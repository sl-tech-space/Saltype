import logging

from apps.common.models import Score, User
from apps.common.utils import HandleExceptions
from django.db import DatabaseError, transaction
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

    def calculate_score(self, typing_count, accuracy):
        """
        タイピング数と正確さに基づいてスコアを計算
        """
        return typing_count * ScoreService.BASE_SCORE_MULTIPLIER * accuracy

    @HandleExceptions()
    def is_new_high_score(self, score):
        """
        最高スコア判定処理
        :return: 
            is_high_score: 最高スコアかどうかのフラグ (bool)
            new_highest_score: 新しい最高スコア (int or None)
        """
        old_highest_score = Score.objects.filter(user_id=self.user_id,
                                                 lang_id=self.lang_id,
                                                 diff_id=self.diff_id).order_by(
                                                     '-score', '-created_at').first()

        if old_highest_score is None or score >= old_highest_score.score:
            return True, score if old_highest_score is None else old_highest_score.score

        return False, old_highest_score.score

    @HandleExceptions()
    def determine_rank(self, score):
        ranks = [(1000, "社長"), (900, "取締役"), (700, "部長"), (500, "課長"), (300, "係長"), (100, "主任"),
                 (0, "メンバー")]
        return next(rank for threshold, rank in ranks if score >= threshold)

    @HandleExceptions()
    def get_ranking_position(self, score):
        """
        現在のユーザーのランキング順位を取得(タイ順位を採用)
        """
        higher_score_count = Score.objects.filter(lang_id=self.lang_id,
                                                  diff_id=self.diff_id,
                                                  score__gt=score).count()

        return higher_score_count + 1

    @staticmethod
    @HandleExceptions()
    def get_average_score(user_id, lang_id, diff_id):
        average_score = Score.objects.filter(user_id=user_id, lang_id=lang_id,
                                             diff_id=diff_id).aggregate(Avg('score'))
        return average_score['score__avg'] or 0

    @transaction.atomic
    @HandleExceptions()
    def save_score_and_update_rank(self, score_data):
        """
        スコアを保存し、必要ならランクを更新する
        """
        score_instance = Score.objects.create(**score_data)

        is_high_score, new_highest_score = self.is_new_high_score(score_data['score'])
        rank = self.determine_rank(score_data['score'])

        if is_high_score:
            user = User.objects.get(user_id=self.user_id)
            user.rank = rank
            user.save()

        return score_instance, is_high_score, new_highest_score, rank
