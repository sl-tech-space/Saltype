from typing import List, Dict
from apps.common.models import Miss
from django.db import transaction
from .base_view import BaseMistypeView


class InsertMistypesView(BaseMistypeView):
    """
    ユーザーのミスタイプを挿入するためのAPIビュークラス。
    ミスタイプの挿入、更新を行います。
    """

    def handle_request(self, validated_data: Dict[str, any]) -> Dict[str, any]:
        """
        ミスタイプを挿入するリクエストを処理します。
        引数として提供されたデータに基づいてミスタイプを挿入または更新します。

        Args:
            validated_data (Dict[str, any]): バリデーションを通過したリクエストデータ。
        Returns:
            Dict[str, any]: ミスタイプ挿入結果を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        mistypes = validated_data["mistypes"]

        # ミスタイプデータを挿入または更新
        inserted_data = self.upsert_mistypes(user_id, mistypes)
        return {"status": "success", "inserted_mistypes": inserted_data}

    @transaction.atomic
    def upsert_mistypes(
        self, user_id: int, mistypes_data: List[Dict[str, any]]
    ) -> List[Dict[str, any]]:
        """
        ミスタイプをデータベースに挿入します。

        トランザクションを利用して、ミスタイプの挿入処理を一貫して行います。

        Args:
            user_id (int): ユーザーID。
            mistypes_data (List[Dict[str, any]]): ミスタイプデータのリスト。
        Returns:
            List[Dict[str, any]]: 挿入または更新されたミスタイプデータのリスト。
        """
        return [self.upsert_mistype(user_id, data) for data in mistypes_data]

    def upsert_mistype(self, user_id: int, data: Dict[str, any]) -> Dict[str, any]:
        """
        個々のミスタイプデータを挿入または更新します。

        Args:
            user_id (int): ユーザーID。
            data (Dict[str, any]): ミスタイプデータ。
        Returns:
            Dict[str, any]: 挿入または更新されたミスタイプデータ。
        """
        miss_char = data.get("miss_char")
        miss_count = data.get("miss_count")

        # miss_charに一致するMissオブジェクトを取得
        miss_instance, created = Miss.objects.get_or_create(
            miss_char=miss_char, user_id=user_id, defaults={"miss_count": miss_count}
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
            validated_data (Dict[str, any]): バリデーション済みのリクエストデータ。
        Returns:
            Dict[str, any]: トップミスタイプデータのレスポンス。
        """
        user_id = validated_data["user_id"]
        limit = validated_data["limit"]

        # トップミスタイプデータを取得
        top_mistypes = self.get_top_mistypes(user_id, limit)
        return {
            "status": "success" if top_mistypes else "not_found",
            "top_mistypes": top_mistypes,
        }

    def get_top_mistypes(self, user_id: int, limit: int) -> List[Dict[str, any]]:
        """
        ユーザーのトップミスタイプを取得します。

        Args:
            user_id (int): ユーザーID。
            limit (int): 取得するミスタイプの件数上限。
        Returns:
            List[Dict[str, any]]: トップミスタイプデータのリスト。
        """
        return [
            {"miss_char": miss.miss_char, "miss_count": miss.miss_count}
            for miss in Miss.objects.filter(user_id=user_id).order_by("-miss_count")[
                :limit
            ]
        ]
