from rest_framework import serializers


class RankingRequestSerializer(serializers.Serializer):
    """
    ランキング取得用のリクエストシリアライザー
    """
    lang_id = serializers.IntegerField()
    diff_id = serializers.IntegerField()
    ranking_limit = serializers.IntegerField(default=10)
