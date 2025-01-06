from apps.common.models import Score
from rest_framework.permissions import AllowAny
from .base_view import BaseRankingView
from datetime import date


class GetRankingView(BaseRankingView):
    """
    ランキング情報を取得するためのAPIビュークラス。
    通常のランキングと日別ランキングを取得する機能を提供します。
    """

    permission_classes = [AllowAny]

    def handle_request(self, validated_data: dict) -> dict:
        """
        リクエストデータに基づいてランキングデータを取得します。

        Args:
            validated_data (dict): 検証済みのリクエストデータ。
                - date (date, optional): 日別ランキング取得時の日付
                - lang_id (int): 言語ID
                - diff_id (int): 難易度ID
                - limit (int): 取得件数

        Returns:
            dict: ランキングデータを含むレスポンス
                - status (str): 処理結果のステータス
                - data (list): ランキングデータのリスト
                    - user_id (UUID): ユーザーID
                    - username (str): ユーザー名
                    - score (int): スコア
        """
        target_date = validated_data.get("date")
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        limit = validated_data["limit"]

        ranking_data = self._get_ranking_data(lang_id, diff_id, limit, target_date)

        return {
            "status": "success",
            "data": [
                {
                    "user_id": data.user.user_id,
                    "username": data.user.username,
                    "score": data.score,
                }
                for data in ranking_data if data.user is not None
            ],
        }

    def _get_ranking_data(
        self, lang_id: int, diff_id: int, limit: int, target_date: date = None
    ) -> list[Score]:
        """
        ランキングデータを取得します。

        Args:
            lang_id (int): 言語ID
            diff_id (int): 難易度ID
            limit (int): 取得件数
            target_date (date, optional): 日別ランキング取得時の日付

        Returns:
            list[Score]: スコアオブジェクトのリスト
        """
        filter_kwargs = {
            "lang_id": lang_id,
            "diff_id": diff_id,
        }
        if target_date:
            filter_kwargs["created_at__date"] = target_date

        return list(
            Score.objects.filter(**filter_kwargs)
            .select_related("user")
            .only("user__user_id", "user__username", "score")
            .order_by("-score")[:limit]
        )
