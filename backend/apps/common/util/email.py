from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

from .exception_handler import HandleExceptions


class ContactEmail:

    def __init__(self, user_id, request_content):
        """初期化処理"""
        self.user_id = user_id
        self.request_content = request_content
        self.User = get_user_model()

    @HandleExceptions()
    def get_user(self):
        """ユーザ情報取得"""
        return self.User.objects.get(user_id=self.user_id)

    def send_request_email(self):
        username = self.get_user()
        subject = f"{username}から要望が届いています。"
        message = f" {username} から:\n\n{self.request_content}\n"

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
