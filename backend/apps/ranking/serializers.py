from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang,User
from datetime import date
from apps.common.serializers import BaseSerializer


class RankingSerializer(BaseSerializer):
    lang_id = serializers.IntegerField()
    diff_id = serializers.IntegerField()
    limit = serializers.IntegerField()
    date = serializers.DateField(required=False)

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
        
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError("limitは正の整数である必要があります。")

        date_value = attrs.get("date")
        if date_value and date_value > date.today():
            raise ValidationError("dateは今日以前の日付でなければなりません。")
        return attrs

