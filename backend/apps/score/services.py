import logging

from apps.common.models import Score, User
from apps.common.utils import HandleExceptions
from django.db import transaction
from django.db.models import Avg

logger = logging.getLogger(__name__)


class ScoreService:
    BASE_SCORE_MULTIPLIER = 10

    def __init__(self, user_id, lang_id, diff_id):
        """
        初期化処理
        :param user_id: ユーザーID
        :param lang_id: 言語ID
        :param diff_id: 難易度ID
        """
        self.user_id = user_id
        self.lang_id = lang_id
        self.diff_id = diff_id

    @staticmethod
    def get_average_score(user_id, lang_id, diff_id):
        """平均スコア取得"""
        average_score = Score.objects.filter(user_id=user_id, lang_id=lang_id,
                                             diff_id=diff_id).aggregate(Avg('score'))
        avg_score = average_score['score__avg'] or 0
        return round(avg_score)

    def calculate_score(self, typing_count, accuracy):
        """スコアを計算"""
        score = typing_count * ScoreService.BASE_SCORE_MULTIPLIER * accuracy
        return round(score)

    @HandleExceptions()
    def is_new_high_score(self, score):
        """最高スコア判定処理"""
        old_highest_score = Score.objects.filter(user_id=self.user_id,
                                                 lang_id=self.lang_id,
                                                 diff_id=self.diff_id).order_by(
                                                     '-score', '-created_at').first()

        if old_highest_score is None or score >= old_highest_score.score:
            return True, score if old_highest_score is None else old_highest_score.score

        return False, old_highest_score.score

    @transaction.atomic
    @HandleExceptions()
    def update_rank(self, score, is_high_score):
        """ランク更新処理"""
        rank = self.determine_rank(score)

        if is_high_score:
            user = User.objects.get(user_id=self.user_id)
            user.rank = rank
            user.save()

        return rank

    def determine_rank(self, score):
        """ランク判定処理"""
        ranks = [(1000, "社長"), (900, "取締役"), (700, "部長"), (500, "課長"), (300, "係長"), (100, "主任"),
                 (0, "メンバー")]
        return next(rank for threshold, rank in ranks if score >= threshold)

    def get_ranking_position(self, score):
        """ランキング取得(タイ順位を採用)"""
        higher_score_count = Score.objects.filter(lang_id=self.lang_id,
                                                  diff_id=self.diff_id,
                                                  score__gt=score).count()

        return higher_score_count + 1
