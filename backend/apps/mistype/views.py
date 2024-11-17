from typing import Any, Dict, List
from apps.common.util.exception_handler import HandleExceptions
from apps.common.models import Miss
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MistypeSerializer


class MistypeView(APIView):
    """
    ミスタイプに関連する操作のためのスーパークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、バリデーションを行った後に具体的な処理を呼び出します。

        Args:
            request: HTTPリクエストオブジェクト。

        Returns:
            Responseオブジェクト: 処理結果をレスポンスとして返します。
        """
        serializer = MistypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response_data = self.handle_request(serializer.validated_data)
        return Response(response_data, status=status.HTTP_200_OK)

    def handle_request(self, validated_data):
        """
        サブクラスで実装するべきリクエストデータの処理メソッド。

        Args:
            validated_data: バリデーション済みのデータ。

        Raises:
            NotImplementedError: サブクラスでこのメソッドが未実装の場合に発生。
        """
        raise NotImplementedError(
            "サブクラスはhandle_requestメソッドを実装する必要があります"
        )


class MistypeDataView(MistypeView):
    """
    ミスタイプの挿入または更新を行うクラス。
    """

    def handle_request(self, validated_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        ミスタイプの挿入または更新を行う処理。

        Args:
            validated_data: バリデーション済みのデータ。

        Returns:
            Dict: 挿入または更新されたデータのレスポンス。
        """
        user_id = validated_data.get("user_id")
        mistypes_data = validated_data.get("mistypes")

        # ミスタイプデータを挿入または更新
        inserted_data = self.insert_mistypes(user_id, mistypes_data)
        return self.format_response(inserted_data)

    @transaction.atomic
    def insert_mistypes(
        self, user_id: int, mistypes_data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        ミスタイプのデータベースへの挿入または更新。

        Args:
            user_id: ユーザーID。
            mistypes_data: ミスタイプデータのリスト。

        Returns:
            List: 挿入または更新されたミスタイプデータのリスト。
        """
        return [self.update_or_create_mistype(data) for data in mistypes_data]

    def update_or_create_mistype(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        個々のミスタイプデータを挿入または更新。

        Args:
            data: ミスタイプデータ（miss_char, miss_countを含む）。

        Returns:
            Dict: 挿入または更新されたデータ。
        """
        miss_char = data.get("miss_char")
        miss_count = data.get("miss_count")

        # miss_charをキーにしてデータを取得または新規作成
        miss_instance, created = Miss.objects.get_or_create(
            miss_char=miss_char, defaults={"miss_count": miss_count}
        )

        # 既存データがあればカウントを更新
        miss_instance.miss_count += miss_count
        miss_instance.save()

        return {
            "miss_char": miss_instance.miss_char,
            "miss_count": miss_instance.miss_count,
        }

    def format_response(self, inserted_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        挿入または更新されたミスタイプデータのフォーマット。

        Args:
            inserted_data: 挿入または更新されたデータのリスト。

        Returns:
            Dict: フォーマット済みのレスポンスデータ。
        """
        return {"status": "success", "inserted_mistypes": inserted_data}


class TopMistypesView(MistypeView):
    """
    ユーザーのトップミスタイプを取得するクラス。
    """

    def handle_request(self, validated_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        検証済みのデータを使用してトップミスタイプを取得。

        Args:
            validated_data: バリデーション済みのデータ。

        Returns:
            Dict: トップミスタイプデータのレスポンス。
        """
        user_id = validated_data["user_id"]
        limit = validated_data["limit"]

        # トップミスタイプデータを取得
        top_mistypes = self.get_top_mistypes(user_id, limit)
        return self.format_response(top_mistypes)

    def get_top_mistypes(self, user_id: int, limit: int) -> List[Dict[str, Any]]:
        """
        ユーザーのトップミスタイプを取得。

        Args:
            user_id: ユーザーID。
            limit: 取得する件数の上限。

        Returns:
            List: トップミスタイプデータのリスト。
        """
        return [
            {"miss_char": miss.miss_char, "miss_count": miss.miss_count}
            for miss in Miss.objects.filter(user_id=user_id).order_by("-miss_count")[
                :limit
            ]
        ]

    def format_response(self, top_mistypes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        トップミスタイプデータのフォーマット。

        Args:
            top_mistypes: トップミスタイプデータのリスト。

        Returns:
            Dict: フォーマット済みのレスポンスデータ。
        """
        if not top_mistypes:
            return {"status": "not_found", "top_mistypes": []}
        return {"status": "success", "top_mistypes": top_mistypes}
