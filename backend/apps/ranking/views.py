from apps.common.models import Score
from apps.common.views import BaseView
from datetime import date
from .serializers import GetRankingSerializer
from django.db.models import Max, Window, F
from django.db.models.functions import Rank

class GetRankingView(BaseView):
    """
    ランキング情報を取得するためのAPIビュークラス。
    通常のランキングと日別ランキングを取得する機能を提供します。
    """
    def post(self, request, *args, **kwargs):
        return super().post(request, GetRankingSerializer, *args, **kwargs)
    
    def handle_post_request(self, validated_data: dict) -> dict:
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
        lang_id = validated_data.get("lang_id")
        diff_id = validated_data.get("diff_id")
        limit = validated_data.get("limit")
        ranking_data = self.get_ranking_data(lang_id, diff_id, limit, target_date)
        return {
            "status": "success",
            "data": [
                {
                    "user_id": data["user__user_id"],
                    "username": data["user__username"],
                    "score": data["score"],
                }
                for data in ranking_data
            ],
        }
        
    def get_ranking_data(
        self, lang_id: int, diff_id: int, limit: int, target_date: date = None
    ) -> list[Score]:
        """
        ランキングデータを取得します。
        ユーザーごとの最高スコアのみを返します。
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
            .annotate(
                rank=Window(
                    expression=Rank(),
                    partition_by=[F("user")],
                    order_by=F("score").desc(),
                )
            )
            .filter(rank=1)
            .values("user__user_id", "user__username", "score")
            .distinct()
            .order_by("-score")
        )[:limit]

