from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from apps.common.models import User, Score
from datetime import date
from django.db.models import Max
from django.template.loader import render_to_string
from apps.common.util.score_util import ScoreUtil


class Command(BaseCommand):
    help = "本日のベストスコアをメールで送信する"

    def handle(self, *args, **options):
        get_score_user_emails = settings.GET_SCORES_EMAILS
        to_sending_emails = settings.TO_SEND_EMAILS
        host_email = settings.EMAIL_HOST_USER

        today = date.today()
        scores = []

        for email in get_score_user_emails:
            user = User.objects.get(email=email)
            highest_score = ScoreUtil.get_today_highest_score(user)
            if highest_score is not None:
                scores.append(
                    {"user__username": user.username, "max_score": highest_score}
                )

        scores.sort(key=lambda x: x["max_score"], reverse=True)

        today_str = today.strftime("%m/%d")
        subject = f"{today_str} - 新卒タイピングスコアランキング"

        # テンプレートをレンダリング
        html_message = render_to_string(
            "best_score_email_template.html", {"today_str": today_str, "scores": scores}
        )

        # メールを送信
        send_mail(subject, "", host_email, to_sending_emails, html_message=html_message)
