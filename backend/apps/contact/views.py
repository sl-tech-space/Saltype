from apps.contact.email import ContactEmail
from rest_framework.permissions import AllowAny
from .base_view import BaseContactView


class ContactView(BaseContactView):
    """
    要望送信APIビュークラス。
    BaseScoreViewを継承して、要望送信処理を実装。
    """

    permission_classes = [AllowAny]

    def handle_request(self, validated_data):
        """
        バリデーション済みデータに基づいて要望を送信する処理を実装。

        Args:
            validated_data: ContactSerializer で検証されたリクエストデータ。
        Returns:
            dict: 処理結果を返す辞書。
        """
        # メール送信処理
        request_email = ContactEmail(
            validated_data["user_id"], validated_data["request_content"]
        )
        request_email.send_request_email()

        return {"message": "要望が正常に送信されました。"}
