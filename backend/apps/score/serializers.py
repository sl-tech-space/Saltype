import logging

from apps.common.models import Diff, Lang, Score, User
from django.shortcuts import get_object_or_404
from rest_framework import serializers

logger = logging.getLogger(__name__)


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
    """ Scoreインスタンスをインサートするためのシリアライザークラス """
    typing_count = serializers.IntegerField(required=True)
    accuracy = serializers.FloatField(required=True)

    class Meta(BaseScoreSerializer.Meta):
        fields = BaseScoreSerializer.Meta.fields + ['typing_count', 'accuracy']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        user = get_object_or_404(User, user_id=user_id)
        lang = validated_data.pop('lang')
        diff = validated_data.pop('diff')
        validated_data['user'] = user

        return Score.objects.create(user=user, lang=lang, diff=diff, **validated_data)


class ScoreSerializer(BaseScoreSerializer):
    """ Scoreモデルのシリアライザークラス """
    typing_count = serializers.IntegerField(write_only=True)
    accuracy = serializers.FloatField(write_only=True)

    class Meta(BaseScoreSerializer.Meta):
        fields = BaseScoreSerializer.Meta.fields + ['score', 'typing_count', 'accuracy']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        typing_count = validated_data.pop('typing_count')
        accuracy = validated_data.pop('accuracy')

        logger.debug(f"user_id: {user_id}, typing_count: {typing_count}, accuracy: {accuracy}")

        user = get_object_or_404(User, user_id=user_id)
        return Score.objects.create(user=user, **validated_data)


class RankUpdateSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(write_only=True)
    new_rank = serializers.CharField(write_only=True)


class PastScoreSerializer(serializers.Serializer):
    """過去スコア取得用のシリアライザー"""
    user_id = serializers.UUIDField()
    lang_id = serializers.PrimaryKeyRelatedField(source='lang',
                                                 queryset=Lang.objects.all(),
                                                 write_only=True)
    diff_id = serializers.PrimaryKeyRelatedField(source='diff',
                                                 queryset=Diff.objects.all(),
                                                 write_only=True)
