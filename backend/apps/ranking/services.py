from apps.common.models import Score


class RankingService:

    def __init__(self, lang_id, diff_id, ranking_count=10):
        self.lang_id = lang_id
        self.diff_id = diff_id
        self.ranking_count = ranking_count

    def get_ranking(self):
        """ランキング取得"""
        return Score.objects.filter(lang_id=self.lang_id, diff_id=self.diff_id) \
            .select_related('user') \
            .order_by('-score')[:self.ranking_count]
