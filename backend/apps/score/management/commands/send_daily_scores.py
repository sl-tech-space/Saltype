from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from apps.common.models import User, Score
from datetime import date
from django.template.loader import render_to_string
from apps.common.util.score_util import ScoreUtil
from collections import defaultdict, OrderedDict


class Command(BaseCommand):
    help = "本日のベストスコアをメールで送信する"

    def handle(self, *args, **options):
        get_score_user_emails = settings.GET_SCORES_EMAILS
        to_sending_emails = settings.TO_SEND_EMAILS
        host_email = settings.EMAIL_HOST_USER

        today = date.today()
        scores_by_diff_and_lang = {}

        for email in get_score_user_emails:
            user = User.objects.get(email=email)
            
            # 難易度と言語の組み合わせごとのスコアを取得
            diff_lang_scores = ScoreUtil.get_today_highest_scores_by_difficulty_and_lang(user)
            
            # 難易度と言語の組み合わせごとにスコアを追加
            for (difficulty, language), score in diff_lang_scores.items():
                if score is not None:
                    key = f"{difficulty}_{language}"
                    if key not in scores_by_diff_and_lang:
                        scores_by_diff_and_lang[key] = []
                    
                    scores_by_diff_and_lang[key].append(
                        {"user__username": user.username, "max_score": score, 
                         "difficulty": difficulty, "language": language}
                    )

        # 各難易度と言語の組み合わせごとにスコアをソート
        for key in scores_by_diff_and_lang:
            scores_by_diff_and_lang[key].sort(key=lambda x: x["max_score"], reverse=True)
            scores_by_diff_and_lang[key] = list(enumerate(scores_by_diff_and_lang[key], 1))

        # 言語と難易度の表示順序を指定
        language_order = ["日本語", "英語"]  # 言語の表示順序
        difficulty_order = ["イージー", "ノーマル", "ハード"]  # 難易度の表示順序
        
        # 言語ごとに難易度をグループ化（順序を保持）
        scores_by_language = OrderedDict()
        
        # 指定した順序で言語を処理
        for lang in language_order:
            scores_by_language[lang] = OrderedDict()
            # 各言語に対して、難易度の順序も初期化
            for diff in difficulty_order:
                scores_by_language[lang][diff] = []
        
        # スコアを言語と難易度でグループ化
        for key, scores in scores_by_diff_and_lang.items():
            if scores:  # スコアが存在する場合のみ
                language = scores[0][1]["language"]
                difficulty = scores[0][1]["difficulty"]
                
                # 言語が指定した順序にない場合は追加
                if language not in scores_by_language:
                    scores_by_language[language] = OrderedDict()
                    for diff in difficulty_order:
                        scores_by_language[language][diff] = []
                
                # 難易度が指定した順序にない場合は追加
                if difficulty not in scores_by_language[language]:
                    scores_by_language[language][difficulty] = []
                
                scores_by_language[language][difficulty] = scores

        today_str = today.strftime("%m/%d")
        subject = f"{today_str} - 新卒タイピングスコアランキング"

        # テンプレートをレンダリング
        html_message = render_to_string(
            "best_score_email_template.html", 
            {
                "today_str": today_str, 
                "scores_by_language": scores_by_language
            }
        )

        # メールを送信
        send_mail(subject, "", host_email, to_sending_emails, html_message=html_message)