from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from apps.common.models import User, Score
from datetime import date


class Command(BaseCommand):
    help = "本日のベストスコアをメールで送信する"

    def handle(self, *args, **options):
        # スコアを取得するユーザーのメールアドレス
        get_score_user_emails = settings.GET_SCORES_EMAILS
        # 実際にスコアを送信する相手のメールアドレス
        to_sending_emails = settings.TO_SEND_EMAILS
        # メール送信元のメールアドレス
        host_email = settings.EMAIL_HOST_USER
        # スコアを取得するユーザーのメールアドレスリストから、ユーザーを取得
        users = User.objects.filter(email__in=get_score_user_emails)

        # 各ユーザーの本日のベストスコアを取得
        scores_list = []
        for user in users:
            today_best_score = self.get_today_highest_score(user)
            score_display = today_best_score if today_best_score is not None else "null"
            scores_list.append((user.username, score_display))

        # スコアを高い順にソート
        scores_list.sort(key=lambda x: x[1], reverse=True)

        # 日付を取得してフォーマット
        today = date.today()
        today_str = today.strftime('%m/%d')

        # メールの件名に日付を追加
        subject = f"{today_str} - 新卒タイピングスコアランキング"

        # メールの内容を作成
        message_lines = [f"{today_str} のスコアランキングを送信します。\n"]
        for rank, (username, score) in enumerate(scores_list, start=1):
            message_lines.append(f"{rank}位 : {username} - スコア : {score}")
        message = "\n".join(message_lines)

        # メールを送信
        send_mail(subject, message, host_email, to_sending_emails)

    def get_today_highest_score(self, user):
        today = date.today()
        todays_score = (
            Score.objects.filter(
                user_id=user.user_id,
                created_at__date=today,
            )
            .order_by("-score")
            .first()
        )
        return todays_score.score if todays_score else None
