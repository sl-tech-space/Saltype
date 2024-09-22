from apps.common.models import Score

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
            
            """ 過去にスコアがない場合 """
            if old_highest_score is None:
                return True, self.score
            
            """ 現在のスコアが過去のスコアより高い場合 """
            if self.score >= old_highest_score.score:
                return True, self.score

            """ 現在のスコアが過去のスコアより低いか同じ場合 """
            return False, old_highest_score.score
        
        except Exception as e:
            logger.error(f"最高スコア判定中にエラーが発生しました: {e}")
            return False, None

    def determine_rank(self):
        """
        スコアに基づいてランクIDを決定する
        :return: ランクID (int)
        """
        rank_thresholds = [
            (1000, 7, "社長"),
            (900, 6, "取締役"),
            (700, 5, "部長"),
            (500, 4, "課長"),
            (300, 3, "係長"),
            (100, 2, "主任"),
            (0, 1, "メンバー")
        ]
        for threshold, rank, title in rank_thresholds:
            if self.score >= threshold:
                return rank
        return 1

    def get_ranking_position(self):
        """
        現在のユーザーのランキング順位を取得(タイ順位を採用)
        """
        
        """ ユーザーの最高スコアを取得 """
        user_score = Score.objects.filter(
            user_id=self.user_id,
            lang_id=self.lang_id,
            diff_id=self.diff_id
        ).order_by('-created_at').first()

        if user_score is None:
            return None

        higher_score_count = Score.objects.filter(
            lang_id=self.lang_id,
            diff_id=self.diff_id,
            score__gt=user_score.score
        ).count()

        return higher_score_count + 1