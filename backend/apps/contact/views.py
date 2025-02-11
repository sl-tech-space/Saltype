from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from .base_view import BaseContactView
from apps.common.models import Request  


class ContactView(BaseContactView):
    """
    要望送信APIビュークラス。
    ユーザーからの要望をメールで送信するための処理を実装します。
    """

    def handle_post_request(self, validated_data: dict) -> dict:
        """
        要望を送信するリクエストを処理します。
        バリデーションを通過したデータを用いて、データベースに保存し、メールを送信します。

        Args:
            validated_data (dict): ContactSerializer で検証されたリクエストデータ。

        Returns:
            dict: 要望送信結果を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        request_content = validated_data["request_content"]

        # ユーザー情報を取得
        User = get_user_model()
        user = User.objects.get(pk=user_id)

        # 要望データをDBに保存
        request_entry = Request.objects.create(
            email=user.email, request_content=request_content
        )

        # メール送信
        subject = f"{user.username} からの要望が届いています。"
        message = (
            f"ユーザー: {user.username} ({user.email})\n\n"
            f"要望内容:\n{request_entry.request_content}\n"
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False,
        )

        return {"message": "要望が正常に送信されました。"}
