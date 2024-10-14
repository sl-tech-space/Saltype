from rest_framework import serializers


class RankingSerializer(serializers.Serializer):
    """ランキング取得用のリクエストシリアライザー"""
    lang_id = serializers.IntegerField()
    diff_id = serializers.IntegerField()
    ranking_count = serializers.IntegerField(default=10)

    def validate_ranking_count(self, value):
        """ranking_count が正の整数であることをバリデーション"""
        if value <= 0:
            raise serializers.ValidationError("ranking_count は正の整数である必要があります。")
        return value
