from apps.common.models import Diff, Lang, Rank, Score, User
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from .services import ScoreService


class BaseScoreSerializer(serializers.ModelSerializer):
    """ Scoreモデルの基底シリアライザークラス """
    user_id = serializers.UUIDField(write_only=True)
    lang_id = serializers.PrimaryKeyRelatedField(source='lang',
                                                 queryset=Lang.objects.all(),
                                                 write_only=True)
    diff_id = serializers.PrimaryKeyRelatedField(source='diff',
                                                 queryset=Diff.objects.all(),
                                                 write_only=True)

    class Meta:
        model = Score
        fields = ['user_id', 'lang_id', 'diff_id']


class ScoreInsertSerializer(BaseScoreSerializer):
    typing_count = serializers.IntegerField(required=True)
    accuracy = serializers.FloatField(required=True)

    class Meta(BaseScoreSerializer.Meta):
        fields = BaseScoreSerializer.Meta.fields + ['typing_count', 'accuracy']

    def create(self, validated_data):
        """スコアインスタンスを作成する"""
        user_id = validated_data.pop('user_id')
        user = get_object_or_404(User, user_id=user_id)
        lang = validated_data.pop('lang')
        diff = validated_data.pop('diff')
        """スコア計算"""
        score_service = ScoreService(user_id=user_id, lang_id=lang.pk, diff_id=diff.pk)
        score_value = score_service.calculate_score(validated_data['typing_count'],
                                                    validated_data['accuracy'])
        """Scoreインスタンス作成"""
        return Score.objects.create(user=user, lang=lang, diff=diff, score=score_value)


class ScoreSerializer(BaseScoreSerializer):
    score = serializers.IntegerField(read_only=True)
    typing_count = serializers.IntegerField(write_only=True)
    accuracy = serializers.FloatField(write_only=True)

    class Meta(BaseScoreSerializer.Meta):
        fields = BaseScoreSerializer.Meta.fields + ['score', 'typing_count', 'accuracy']

    def create(self, validated_data):
        """スコアインスタンス作成処理"""
        user_id = validated_data.pop('user_id')
        user = get_object_or_404(User, user_id=user_id)
        """Scoreインスタンス作成"""
        return Score.objects.create(user=user, **validated_data)


class RankUpdateSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(write_only=True)
    new_rank = serializers.CharField(write_only=True)

    def validate_new_rank(self, value):
        """指定されたランクが存在するか確認するバリデーション"""
        if not Rank.objects.filter(rank=value).exists():
            raise serializers.ValidationError("指定されたランクは存在しません。")
        return value


class PastScoreSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    lang_id = serializers.PrimaryKeyRelatedField(source='lang',
                                                 queryset=Lang.objects.all(),
                                                 write_only=True)
    diff_id = serializers.PrimaryKeyRelatedField(source='diff',
                                                 queryset=Diff.objects.all(),
                                                 write_only=True)
