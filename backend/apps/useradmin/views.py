from django.db.models import Max
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.common.models import Score, Rank, User
from .serializers import UserAdminSerializer


class UserInfoView(APIView):
    """
    管理画面でユーザーのスコア情報を取得するAPIビュークラス。
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        ユーザーのスコア情報を取得するエンドポイント。
        """
        serializer = UserAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        user_id = validated_data["user_id"]

        # 各種情報の取得
        latest_scores_by_mode = self.get_latest_scores(user_id)
        user_rank = self.get_user_rank(user_id)
        highest_score = self.get_highest_score(user_id)

        return Response(
            {
                "status": "success",
                "user_id": user_id,
                "latest_scores": latest_scores_by_mode,
                "user_rank": user_rank,
                "highest_score": highest_score,
            },
            status=status.HTTP_200_OK,
        )

    def get_latest_scores(self, user_id: str) -> list:
        """
        各難易度および言語ごとに最新のスコアを取得。
        """
        scores = (
            Score.objects.filter(user_id=user_id)
            .values("diff_id", "lang_id")
            .annotate(latest_score=Max("score"))
        )
        return [
            {
                "diff_id": score["diff_id"],
                "lang_id": score["lang_id"],
                "latest_score": score["latest_score"],
            }
            for score in scores
        ]

    def get_user_rank(self, user_id: str) -> str:
        """
        ユーザーのランクを取得。
        """
        user = get_object_or_404(User, pk=user_id)
        rank = Rank.objects.filter(rank_id=user.rank_id).first()
        return rank.rank if rank else "Unknown"

    def get_highest_score(self, user_id: str) -> dict:
        """
        ユーザーの最高スコアを取得。
        """
        highest_score_data = (
            Score.objects.filter(user_id=user_id)
            .annotate(highest_score=Max("score"))
            .values("highest_score", "diff_id", "lang_id")
            .first()
        )
        if highest_score_data:
            return {
                "diff_id": highest_score_data["diff_id"],
                "lang_id": highest_score_data["lang_id"],
                "score": highest_score_data["highest_score"],
            }
        return {"diff_id": None, "lang_id": None, "score": 0}
