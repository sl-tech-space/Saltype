from apps.contact.email import ContactEmail
from rest_framework.permissions import AllowAny
from .base_view import BaseContactView


class ContactView(BaseContactView):
    """
    要望送信APIビュークラス。
    ユーザーからの要望をメールで送信するための処理を実装します。
    """

    permission_classes = [AllowAny]

    def handle_request(self, validated_data: dict) -> dict:
        """
        要望を送信するリクエストを処理します。
        バリデーションを通過したデータを用いてメールを送信します。

        Args:
            validated_data (dict): ContactSerializer で検証されたリクエストデータ。
        Returns:
            dict: 要望送信結果を含むレスポンスデータ。
        """
        # ContactEmailクラスを使用して要望をメールで送信
        request_email = ContactEmail(
            validated_data["user_id"], validated_data["request_content"]
        )
        request_email.send_request_email()

        return {"message": "要望が正常に送信されました。"}
