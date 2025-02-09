from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from apps.common.models import User, Score
from datetime import date


class Command(BaseCommand):
    help = "本日のベストスコアをメールで送信する"

    def handle(self, *args, **options):
        # メールアドレスを設定から取得
        recipient_emails = settings.RECIPIENT_EMAILS
        sender_email = settings.SENDER_EMAIL

        # メールアドレスに対応するユーザーを取得
        users = User.objects.filter(email__in=recipient_emails)

        # 各ユーザーの本日のベストスコアを取得
        scores_list = []
        for user in users:
            today_best_score = self.get_today_highest_score(user)
            score_display = today_best_score if today_best_score is not None else "null"
            scores_list.append((user.username, score_display))

        # スコアを高い順にソート
        scores_list.sort(key=lambda x: x[1], reverse=True)

        # メールの内容を作成
        subject = "本日のスコアランキング！"
        message_lines = ["本日のスコアランキング！\n"]
        for rank, (username, score) in enumerate(scores_list, start=1):
            message_lines.append(f"{rank}位: {username} - スコア: {score}")
        message = "\n".join(message_lines)

        # メールを送信
        send_mail(subject, message, sender_email, recipient_emails)

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
