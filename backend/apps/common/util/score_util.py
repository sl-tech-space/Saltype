from datetime import date
from rest_framework.exceptions import ValidationError
from apps.common.models import User, Lang, Diff, Score

class ScoreUtil:
    """
    共通のバリデーションロジックやユーティリティメソッドを提供するクラス。
    """

    @staticmethod
    def get_today_highest_score(user):
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
                user=user,
                created_at__date=today,
            )
            .order_by("-score")
            .first()
        )

        return todays_score.score if todays_score else None
