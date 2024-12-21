from apps.common.models import Score
from rest_framework.permissions import AllowAny
from .base_view import BaseRankingView
from datetime import date


class GetRankingView(BaseRankingView):
    """
    ランキング情報を取得するためのAPIビュークラス。
    このクラスは、通常のランキングと日別ランキングを取得する機能を提供します。
    """

    permission_classes = [AllowAny]

    def handle_request(self, validated_data):
        """
        リクエストデータに基づいてランキングデータを取得します。
        リクエストに日付が含まれている場合は日別ランキングを取得し、
        含まれていない場合は通常のランキングを取得します。

        Args:
            validated_data (dict): 検証済みのリクエストデータ。
        Returns:
            dict: 取得したランキングデータを含む辞書。`status` と `data` のフィールドを含みます。
        """
        # リクエストデータから 'date' を取得。'date' がない場合は None となる。
        date = validated_data.get("date")
        # 他のパラメータを取得
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        limit = validated_data["limit"]

        if date:
            ranking_datas = self.get_daily_ranking(lang_id, diff_id, limit, date)
        else:
            ranking_datas = self.get_ranking(lang_id, diff_id, limit)

        return {
            "status": "success",
            "data": [
                {
                    "user_id": ranking_data.user.user_id,
                    "username": ranking_data.user.username,
                    "score": ranking_data.score,
                }
                for ranking_data in ranking_datas
            ],
        }

    def get_ranking(self, lang_id: int, diff_id: int, limit: int):
        """
        通常のランキングを取得するメソッド。

        指定された `lang_id`（言語）、`diff_id`（難易度）、`limit`（表示件数）に基づいて、
        ランキングデータを取得します。

        Args:
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
            limit (int): 取得するランキングの件数。
        Returns:
            list: 取得したランキングデータ（Scoreオブジェクトのリスト）。
        """
        return list(
            Score.objects.filter(lang_id=lang_id, diff_id=diff_id)
            .select_related("user")
            .only("user__user_id", "user__username", "score")
            .order_by("-score")[:limit]
        )

    def get_daily_ranking(self, lang_id: int, diff_id: int, limit: int, date: date):
        """
        日別ランキングを取得するメソッド。

        指定された `lang_id`（言語）、`diff_id`（難易度）、`date`（日付）、`limit`（表示件数）に基づいて、
        特定の日付のランキングデータを取得します。

        Args:
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
            limit (int): 取得するランキングの件数。
            date (date): 対象の日付。
        Returns:
            list: 取得した日別ランキングデータ（Scoreオブジェクトのリスト）。
        """
        return list(
            Score.objects.filter(
                lang_id=lang_id,
                diff_id=diff_id,
                created_at__date=date,
            )
            .select_related("user")
            .only("user__user_id", "user__username", "score")
            .order_by("-score")[:limit]
        )
