from typing import List, Dict
from apps.common.models import Miss
from django.db import transaction
from .base_view import BaseMistypeView


class InsertMistypesView(BaseMistypeView):
    """
    ミスタイプの挿入、更新、またはトップミスタイプを取得するクラス。
    ユーザーが発生させたミスタイプを管理するための処理を提供。
    """

    def handle_request(self, validated_data: Dict[str, any]) -> Dict[str, any]:
        """
        ミスタイプの挿入または更新を行う処理。

        Args:
            validated_data: バリデーション済みのリクエストデータ。
                - "user_id" : ユーザーID
                - "mistypes" : ミスタイプデータのリスト（各ミスタイプに関する情報）
        Returns:
            Dict: 挿入または更新されたデータのレスポンス。
                - "status" : 処理結果 ("success" が返される)
                - "inserted_mistypes" : 挿入または更新されたミスタイプデータのリスト
        """
        user_id = validated_data["user_id"]
        mistypes = validated_data["mistypes"]

        # ミスタイプデータを挿入または更新
        inserted_data = self.upsert_mistypes(user_id, mistypes)
        return {"status": "success", "inserted_mistypes": inserted_data}

    @transaction.atomic
    def upsert_mistypes(self, user_id: int, mistypes_data: List[Dict[str, any]]) -> List[Dict[str, any]]:
        """
        ミスタイプのデータベースへの挿入または更新。

        Args:
            user_id: ユーザーID。
            mistypes_data: ミスタイプデータのリスト（各ミスタイプの情報）
        Returns:
            List: 挿入または更新されたミスタイプデータのリスト。
                - 各ミスタイプの "miss_char" と "miss_count" を含む辞書。
        """
        return [self.upsert_mistype(user_id, data) for data in mistypes_data]

    def upsert_mistype(self, user_id: int, data: Dict[str, any]) -> Dict[str, any]:
        """
        個々のミスタイプデータを挿入または更新。

        Args:
            data: ミスタイプデータ（miss_char, miss_countを含む）
        Returns:
            Dict: 挿入または更新されたミスタイプデータ。
                - "miss_char" : ミスタイプの文字
                - "miss_count" : 発生回数
        """
        miss_char = data.get("miss_char")
        miss_count = data.get("miss_count")

        # miss_charに一致するMissオブジェクトを取得
        miss_instance, created = Miss.objects.get_or_create(
            miss_char=miss_char, user_id=user_id,
            defaults={"miss_count": miss_count}
        )

        if not created:
            miss_instance.miss_count += miss_count
            miss_instance.save()

        return {
            "miss_char": miss_instance.miss_char,
            "miss_count": miss_instance.miss_count,
        }


class GetTopMistypesView(BaseMistypeView):
    """
    ユーザーのトップミスタイプを取得するクラス。
    ユーザーが発生させたミスタイプの中で最も発生回数が多いものを取得。
    """

    def handle_request(self, validated_data: Dict[str, any]) -> Dict[str, any]:
        """
        検証済みのデータを使用してトップミスタイプを取得。

        Args:
            validated_data: バリデーション済みのリクエストデータ。
                - "user_id" : ユーザーID
                - "limit" : 取得するミスタイプの件数上限
        Returns:
            Dict: トップミスタイプデータのレスポンス。
                - "status" : 処理結果 ("success" または "not_found")
                - "top_mistypes" : トップミスタイプデータのリスト
        """
        user_id = validated_data["user_id"]
        limit = validated_data["limit"]

        # トップミスタイプデータを取得
        top_mistypes = self.get_top_mistypes(user_id, limit)
        return {"status": "success" if top_mistypes else "not_found", "top_mistypes": top_mistypes}

    def get_top_mistypes(self, user_id: int, limit: int) -> List[Dict[str, any]]:
        """
        ユーザーのトップミスタイプを取得。

        Args:
            user_id: ユーザーID
            limit: 取得するミスタイプの件数上限
        Returns:
            List: トップミスタイプデータのリスト
                - 各ミスタイプの "miss_char" と "miss_count" を含む辞書
        """
        return [
            {"miss_char": miss.miss_char, "miss_count": miss.miss_count}
            for miss in Miss.objects.filter(user_id=user_id).order_by("-miss_count")[:limit]
        ]
