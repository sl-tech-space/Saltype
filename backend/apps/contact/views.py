import threading
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from apps.common.models import Request
from apps.common.views import BaseView
from apps.contact.serializers import ContactSerializer


class ContactView(BaseView):
    """
    要望送信APIビュークラス。
    ユーザーからの要望をメールで送信するための処理を実装します。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, ContactSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data: dict) -> dict:
        """
        要望を送信するリクエストを処理します。
        バリデーションを通過したデータを用いて、データベースに保存し、メールを非同期で送信します。

        Args:
            validated_data (dict): ContactSerializer で検証されたリクエストデータ。
        Returns:
            dict: 要望送信結果を含むレスポンスデータ。
        """
        user_id = validated_data.get("user_id")
        request_content = validated_data.get("request_content")

        # ユーザー情報を取得
        User = get_user_model()
        user = User.objects.get(pk=user_id)

        # 要望データをDBに保存
        request_entry = Request.objects.create(
            email=user.email, request_content=request_content
        )

        # 非同期でメール送信
        thread = threading.Thread(
            target=self.send_request_email, args=(user, request_entry)
        )
        thread.start()

        return {"message": "要望が正常に送信されました。"}

    def send_request_email(self, user, request_entry):
        """
        メールを非同期で送信する処理。

        Args:
            user (User): ユーザーモデルのインスタンス。
            request_entry (Request): 保存したリクエストデータ。
        """
        subject = f"{user.username} からの要望が届いています。"

        # HTMLテンプレートをレンダリング
        html_message = render_to_string(
            "contact_email_template.html",
            {"user": user, "request_content": request_entry.request_content},
        )

        send_mail(
            subject=subject,
            message="",  # テキストメッセージは空にする
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False,
            html_message=html_message,  # HTMLメッセージを指定
        )
