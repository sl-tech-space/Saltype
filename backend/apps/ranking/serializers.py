from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang
from datetime import date


class RankingSerializer(serializers.Serializer):
    """
    ランキング取得リクエストを処理するためのシリアライザー。
    言語ID、難易度ID、取得上限、日付などを検証します。
    """

    lang_id = serializers.IntegerField()  # 言語ID（整数）
    diff_id = serializers.IntegerField()  # 難易度ID（整数）
    limit = serializers.IntegerField()  # 取得上限
    date = serializers.DateField(required=False)  # 日付（省略可能）

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        limitが正の整数であり、dateが今日以前であることを確認します。
        """
        self._validate_lang_id(attrs)
        self._validate_diff_id(attrs)
        self._validate_limit(attrs)
        self._validate_date(attrs)

        return attrs

    def _validate_lang_id(self, attrs):
        lang_id = attrs.get("lang_id")
        if lang_id and not Lang.objects.filter(pk=lang_id).exists():
            raise ValidationError({"lang_id": "指定された言語は存在しません。"})

    def _validate_diff_id(self, attrs):
        diff_id = attrs.get("diff_id")
        if diff_id and not Diff.objects.filter(pk=diff_id).exists():
            raise ValidationError({"diff_id": "指定された難易度は存在しません。"})

    def _validate_limit(self, attrs):
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError("limitは正の整数である必要があります。")

    def _validate_date(self, attrs):
        date_value = attrs.get("date")
        if date_value and date_value > date.today():
            raise ValidationError("dateは今日以前の日付でなければなりません。")
