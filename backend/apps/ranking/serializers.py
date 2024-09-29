from rest_framework import serializers


class RankingSerializer(serializers.Serializer):
    """ランキング取得用のリクエストシリアライザー"""
    lang_id = serializers.IntegerField()  # 言語ID
    diff_id = serializers.IntegerField()  # 難易度ID
    ranking_count = serializers.IntegerField(default=10)  # ランキングの上限（デフォルト10）

    def validate_ranking_count(self, value):
        """ranking_limit が正の整数であることをバリデーション"""
        if value <= 0:
            raise serializers.ValidationError("ranking_count は正の整数である必要があります。")
        return value
