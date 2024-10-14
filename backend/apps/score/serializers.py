import logging

from apps.common.models import Diff, Lang, Rank, Score, User
from django.shortcuts import get_object_or_404
from rest_framework import serializers

logger = logging.getLogger(__name__)


class ScoreSerializer(serializers.ModelSerializer):
    """ Scoreモデルのシリアライザークラス """
    user_id = serializers.UUIDField(write_only=True)
    lang_id = serializers.PrimaryKeyRelatedField(source='lang',
                                                 queryset=Lang.objects.all(),
                                                 write_only=True)
    diff_id = serializers.PrimaryKeyRelatedField(source='diff',
                                                 queryset=Diff.objects.all(),
                                                 write_only=True)
    typing_count = serializers.IntegerField(write_only=True)  # 追加
    accuracy = serializers.FloatField(write_only=True)  # 追加

    class Meta:
        model = Score
        fields = ['user_id', 'score', 'lang_id', 'diff_id', 'typing_count', 'accuracy']  # 追加

    def create(self, validated_data):
        """
        シリアライズされたデータからScoreインスタンスを作成する
        :param validated_data: バリデーション済みのデータ
        :return: 新しく作成されたScoreインスタンス
        """
        user_id = validated_data.pop('user_id')
        lang = validated_data.pop('lang')
        diff = validated_data.pop('diff')
        typing_count = validated_data.pop('typing_count')  # 追加
        accuracy = validated_data.pop('accuracy')  # 追加

        logger.debug(
            f"user_id: {user_id}, lang: {lang}, diff: {diff}, typing_count: {typing_count}, accuracy: {accuracy}"
        )  # ログ出力

        user = get_object_or_404(User, user_id=user_id)
        return Score.objects.create(user=user, lang=lang, diff=diff, **validated_data)


class ScoreInsertSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    lang_id = serializers.PrimaryKeyRelatedField(source='lang',
                                                 queryset=Lang.objects.all(),
                                                 write_only=True)
    diff_id = serializers.PrimaryKeyRelatedField(source='diff',
                                                 queryset=Diff.objects.all(),
                                                 write_only=True)
    score = serializers.IntegerField(write_only=True)

    def create(self, validated_data):
        """
        シリアライズされたデータからScoreインスタンスを作成する
        :param validated_data: バリデーション済みのデータ
        :return: 新しく作成されたScoreインスタンス
        """
        user_id = validated_data.pop('user_id')
        lang = validated_data.pop('lang')
        diff = validated_data.pop('diff')
        score = validated_data.pop('score')

        user = get_object_or_404(User, user_id=user_id)

        return Score.objects.create(user=user, lang=lang, diff=diff, score=score)


class RankUpdateSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    new_rank = serializers.CharField()


class PastScoreSerializer(serializers.Serializer):
    """過去スコア取得用のシリアライザー"""
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

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        lang = validated_data.pop('lang')
        diff = validated_data.pop('diff')

        logger.debug(f"user_id: {user_id}, lang: {lang}, diff: {diff}")

        user = get_object_or_404(User, user_id=user_id)
        return Score.objects.create(user=user, lang=lang, diff=diff, **validated_data)
