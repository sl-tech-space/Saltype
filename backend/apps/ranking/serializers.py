from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang
from datetime import date
from apps.common.serializers import BaseSerializer

class RankingSerializer(BaseSerializer):
    lang_id = serializers.IntegerField()
    diff_id = serializers.IntegerField()
    limit = serializers.IntegerField()
    date = serializers.DateField(required=False)

    def validate(self, attrs):
        self.validate_existence(attrs, "lang_id", Lang, "指定された言語は存在しません。")
        self.validate_existence(attrs, "diff_id", Diff, "指定された難易度は存在しません。")
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError("limitは正の整数である必要があります。")
        date_value = attrs.get("date")
        if date_value and date_value > date.today():
            raise ValidationError("dateは今日以前の日付でなければなりません。")
        return attrs
