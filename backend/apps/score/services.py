from apps.common.models import Score
from django.db.models import Avg

import logging

logger = logging.getLogger(__name__)

class ScoreService:
    def __init__(self, user_id, lang_id, diff_id, score):
        """
        初期化処理
        :param user_id: ユーザーID
        :param lang_id: 言語ID
        :param diff_id: 難易度ID
        :param score: 取得スコア
        """
        self.user_id = user_id
        self.lang_id = lang_id
        self.diff_id = diff_id
        self.score = score
        
    def calculate_score(self, data):
        """
        タイピング数と正確さに基づいてスコアを計算
        """
        typing_count = data.get('typing_count', 0)
        accuracy = data.get('accuracy', 1.0)
        base_multiplier = 10 
        return typing_count * base_multiplier * accuracy
    

    def is_new_high_score(self):
        """
        最高スコア判定処理
        :return: 
            is_high_score: 最高スコアかどうかのフラグ (bool)
            new_highest_score: 新しい最高スコア (int or None)
        """
        try:
            old_highest_score = Score.objects.filter(
                user_id=self.user_id,
                lang_id=self.lang_id,
                diff_id=self.diff_id
            ).order_by('-score', '-created_at').first()

            if old_highest_score is None:
                return True, self.score

            if self.score >= old_highest_score.score:
                return True, self.score

            return False, old_highest_score.score

        except Exception as e:
            logger.error(f"最高スコア判定中にエラーが発生しました: {e}")
            raise e

    def determine_rank(self):
        """
        スコアに基づいてランク名を決定する
        :return: ランク名 (str)
        """
        rank_thresholds = [
            (1000, "社長"),
            (900, "取締役"),
            (700, "部長"),
            (500, "課長"),
            (300, "係長"),
            (100, "主任"),
            (0, "メンバー")
        ]
        for threshold, rank_name in rank_thresholds:
            if self.score >= threshold:
                return rank_name
        return "メンバー"

    def get_ranking_position(self):
        """
        現在のユーザーのランキング順位を取得(タイ順位を採用)
        """
        try:
            """ ユーザーの最高スコアを取得 """
            user_score = Score.objects.filter(
                user_id=self.user_id,
                lang_id=self.lang_id,
                diff_id=self.diff_id
            ).order_by('-created_at').first()

            if not user_score:
                return None

            higher_score_count = Score.objects.filter(
            lang_id=self.lang_id,
            diff_id=self.diff_id,
            score__gt=user_score.score
            ).count()

            return higher_score_count + 1

        except Exception as e:
            logger.error(f"ランキング順位の取得中にエラーが発生しました: {e}")
            raise e

    @staticmethod
    def get_average_score(user_id, lang_id, diff_id):
        """
        指定されたユーザー、言語、難易度の平均スコアを取得
        """
        try:
            average_score = Score.objects.filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id).aggregate(Avg('score'))
            return average_score['score__avg'] if average_score['score__avg'] is not None else 0
        except Exception as e:
            logger.error(f"平均スコア取得中にエラーが発生しました: {e}")
            raise e