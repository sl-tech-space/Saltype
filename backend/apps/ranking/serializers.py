from rest_framework import serializers


class RankingSerializer(serializers.Serializer):
    """ランキング取得用のリクエストシリアライザー"""

    lang_id = serializers.IntegerField()
    diff_id = serializers.IntegerField()
    limit = serializers.IntegerField()
    date = serializers.DateField(required=False)

    def validate(self, attrs):
        """limitが正の整数であることを検証"""
        limit = attrs.get("limit")
        if limit <= 0:
            raise serializers.ValidationError("limitは正の整数である必要があります。")

        return attrs
