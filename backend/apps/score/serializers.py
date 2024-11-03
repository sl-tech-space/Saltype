from apps.common.models import Diff, Lang, Rank, User
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class ScoreSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(required=False)
    lang_id = serializers.IntegerField(required=False)
    diff_id = serializers.IntegerField(required=False)
    typing_count = serializers.IntegerField(required=False)
    accuracy = serializers.FloatField(required=False)
    score = serializers.IntegerField(required=False)
    new_rank = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        if 'user_id' in attrs:
            user = get_object_or_404(User, pk=attrs['user_id'])
            attrs['user'] = user

        if 'lang_id' in attrs:
            lang = get_object_or_404(Lang, pk=attrs['lang_id'])
            attrs['lang'] = lang

        if 'diff_id' in attrs:
            diff = get_object_or_404(Diff, pk=attrs['diff_id'])
            attrs['diff'] = diff

        if 'typing_count' in attrs and attrs['typing_count'] < 0:
            raise ValidationError({"typing_count": "タイプ数は0以上でなければなりません。"})

        if 'accuracy' in attrs and not (0 <= attrs['accuracy'] <= 1):
            raise ValidationError({"accuracy": "精度は0から1の間でなければなりません。"})

        if 'new_rank' in attrs:
            rank_id = self.get_rank_id(attrs['new_rank'])
            attrs['rank_id'] = rank_id

        return attrs

    def get_rank_id(self, rank_name):
        rank = get_object_or_404(Rank, rank=rank_name)
        return rank.rank_id
