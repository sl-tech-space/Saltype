from apps.common.models import Score
from rest_framework.permissions import AllowAny
from .base_view import BaseRankingView


class RankingView(BaseRankingView):
    """
    ランキング情報を取得するためのAPIビュークラス。
    """

    permission_classes = [AllowAny]

    def handle_request(self, validated_data):
        """
        リクエストデータに基づいてランキングデータを取得。

        Args:
            validated_data: 検証済みのリクエストデータ。
        Returns:
            dict: 取得したランキングデータを含む辞書。
        """
        date = validated_data.get("date")

        if date:
            ranking_datas = self.get_daily_ranking(validated_data)
        else:
            ranking_datas = self.get_ranking(validated_data)
        return self.format_response(ranking_datas)

    def get_ranking(self, validated_data: dict):
        """
        通常のランキングを取得するメソッド。

        Args:
            validated_data: 言語ID、難易度ID、ランキング表示件数などのデータ。
        Returns:
            list: 取得したランキングデータのリスト（Scoreオブジェクト）。
        """
        return list(
            Score.objects.filter(
                lang_id=validated_data["lang_id"], diff_id=validated_data["diff_id"]
            )
            .select_related("user")
            .only("user__user_id", "user__username", "score")
            .order_by("-score")[: validated_data["limit"]]
        )

    def get_daily_ranking(self, validated_data: dict):
        """
        日別ランキングを取得するメソッド。

        Args:
            validated_data: 言語ID、難易度ID、日付、ランキング表示件数などのデータ。
        Returns:
            list: 取得した日別ランキングデータのリスト（Scoreオブジェクト）。
        """
        return list(
            Score.objects.filter(
                lang_id=validated_data["lang_id"],
                diff_id=validated_data["diff_id"],
                created_at__date=validated_data["date"],
            )
            .select_related("user")
            .only("user__user_id", "user__username", "score")
            .order_by("-score")[: validated_data["limit"]]
        )

    def format_response(self, ranking_datas):
        """
        取得したランキングデータをフォーマットするメソッド。

        Args:
            ranking_datas: ランキングデータのリスト（Scoreオブジェクトのリスト）。
        Returns:
            dict: フォーマット済みのランキングデータを含む辞書。
        """
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
