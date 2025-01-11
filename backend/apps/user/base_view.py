from apps.common.util.exception_handler import HandleExceptions
from datetime import date
from .serializers import UserSerializer
from apps.common.models import Score
from apps.common.views import BaseView


class BaseUserView(BaseView):
    """
    ユーザー関連の操作を共通化するための基底クラス。
    """

    def get_today_highest_score(self, user):
        """
        ユーザーの今日の最高スコアを取得する共通メソッド。
        指定されたユーザーの今日の最高スコアをデータベースから取得します。

        Args:
            user: ユーザーオブジェクト。
        Returns:
            int or None: 今日の最高スコア（スコアが存在しない場合はNone）。
        """
        today = date.today()

        # ユーザーの今日の最高スコアを取得
        todays_score = (
            Score.objects.filter(
                user_id=user.user_id,
                created_at__date=today,
            )
            .order_by("-score")
            .first()
        )

        return todays_score.score if todays_score else None

