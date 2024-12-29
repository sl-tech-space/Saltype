from rest_framework import serializers
from apps.common.models import Diff, Lang, User
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError

class ScoreSerializer(BaseSerializer):
    ACTION_CHOICES = ["get_average_score", "get_past_scores"]
    action = serializers.ChoiceField(choices=ACTION_CHOICES, required=False)
    user_id = serializers.UUIDField()
    lang_id = serializers.IntegerField()
    diff_id = serializers.IntegerField()
    typing_count = serializers.IntegerField(required=False, min_value=0)
    accuracy = serializers.FloatField(required=False, min_value=0, max_value=1)
    score = serializers.IntegerField(required=False, min_value=0)

    def validate(self, attrs):
        # ユーザーの存在を確認し、オブジェクトを追加
        user_id = attrs.get("user_id")
        if user_id:
            try:
                attrs["user"] = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                raise ValidationError({"user_id": "指定されたユーザーは存在しません。"})

        # 言語の存在を確認し、オブジェクトを追加
        lang_id = attrs.get("lang_id")
        if lang_id:
            try:
                attrs["lang"] = Lang.objects.get(pk=lang_id)
            except Lang.DoesNotExist:
                raise ValidationError({"lang_id": "指定された言語は存在しません。"})

        # 難易度の存在を確認し、オブジェクトを追加
        diff_id = attrs.get("diff_id")
        if diff_id:
            try:
                attrs["diff"] = Diff.objects.get(pk=diff_id)
            except Diff.DoesNotExist:
                raise ValidationError({"diff_id": "指定された難易度は存在しません。"})

        # アクションの検証
        action = attrs.get("action")
        if action and action not in self.ACTION_CHOICES:
            raise ValidationError("無効なアクションが指定されました。")

        return attrs
