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

    @staticmethod
    def get_today_highest_scores_by_difficulty_and_lang(user):
        """
        ユーザーの今日の難易度と言語ごとの最高スコアを取得する共通メソッド。
        
        Args:
            user: ユーザーオブジェクト。
        Returns:
            dict: 難易度と言語の組み合わせをキー、最高スコアを値とする辞書。
                  例: {('初級', 'Python'): 100, ('中級', 'Java'): 80}
        """
        today = date.today()
        
        # 全ての難易度と言語を取得
        all_difficulties = Diff.objects.all()
        all_languages = Lang.objects.all()
        
        # 結果を格納する辞書を初期化
        highest_scores = {}
        
        # 各難易度と言語の組み合わせごとに最高スコアを取得
        for difficulty in all_difficulties:
            for language in all_languages:
                todays_score = (
                    Score.objects.filter(
                        user=user,
                        created_at__date=today,
                        diff=difficulty,
                        lang=language,
                    )
                    .order_by("-score")
                    .first()
                )
                
                # 辞書に難易度と言語の組み合わせとスコアを追加
                key = (difficulty.diff, language.lang)
                highest_scores[key] = todays_score.score if todays_score else None
            
        return highest_scores