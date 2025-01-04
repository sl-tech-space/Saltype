from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

from apps.common.util.exception_handler import HandleExceptions


class ContactEmail:
    """
    ユーザーからの要望をメールで送信するためのクラス。
    """

    def __init__(self, user_id: int, request_content: str):
        """
        ContactEmailクラスの初期化を行います。

        Args:
            user_id (int): ユーザーのID。
            request_content (str): ユーザーからの要望内容。
        """
        self.user_id = user_id
        self.request_content = request_content
        self.User = get_user_model()

    @HandleExceptions()
    def get_user(self):
        """
        ユーザー情報を取得します。

        Returns:
            User: 指定されたIDのユーザーオブジェクト。
        """
        try:
            return self.User.objects.get(pk=self.user_id)
        except self.User.DoesNotExist:
            raise ValueError("指定されたユーザーは存在しません。")

    def send_request_email(self):
        """
        要望をメールで送信します。
        """
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
