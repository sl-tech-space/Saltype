import logging

from apps.common.models import Diff, Lang, Score, User
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

    class Meta:
        model = Score
        fields = ['user_id', 'score', 'lang_id', 'diff_id']

    def create(self, validated_data):
        """
        シリアライズされたデータからScoreインスタンスを作成する
        :param validated_data: バリデーション済みのデータ
        :return: 新しく作成されたScoreインスタンス
        """
        user_id = validated_data.pop('user_id')
        lang = validated_data.pop('lang')
        diff = validated_data.pop('diff')

        logger.debug(f"user_id: {user_id}, lang: {lang}, diff: {diff}")

        user = get_object_or_404(User, user_id=user_id)
        return Score.objects.create(user=user, lang=lang, diff=diff, **validated_data)
