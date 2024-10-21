from rest_framework import serializers


class RankingSerializer(serializers.Serializer):
    """ランキング取得用のリクエストシリアライザー"""
    lang_id = serializers.IntegerField()
    diff_id = serializers.IntegerField()
    ranking_count = serializers.IntegerField(default=10)

    def validate_ranking_count(self, value):

        if value <= 0:
            raise serializers.ValidationError(("ranking_countは正の整数である必要があります。"))
        return value
