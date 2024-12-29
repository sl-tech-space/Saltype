from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

from apps.common.util.exception_handler import HandleExceptions


class ContactEmail:

    def __init__(self, user_id, request_content):
        """初期化処理"""
        self.user_id = user_id
        self.request_content = request_content
        self.User = get_user_model()

    @HandleExceptions()
    def get_user(self):
        """ユーザ情報取得"""
        try:
            return self.User.objects.get(pk=self.user_id)
        except self.User.DoesNotExist:
            raise ValueError("指定されたユーザーは存在しません。")

    def send_request_email(self):
        user = self.get_user()
        subject = f"{user.username}から要望が届いています。"
        message = f"{user.username} から:\n\n{self.request_content}\n"

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
