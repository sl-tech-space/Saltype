from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang, User, Score
from datetime import date as today


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
        # 言語IDの検証
        if "lang_id" in attrs:
            try:
                lang = Lang.objects.get(pk=attrs["lang_id"])
                attrs["lang"] = lang
            except Lang.DoesNotExist:
                raise ValidationError({"lang_id": "指定された言語は存在しません。"})

        # 難易度IDの検証
        if "diff_id" in attrs:
            try:
                diff = Diff.objects.get(pk=attrs["diff_id"])
                attrs["diff"] = diff
            except Diff.DoesNotExist:
                raise ValidationError({"diff_id": "指定された難易度は存在しません。"})

        # limitの検証
        limit = attrs.get("limit")
        if limit <= 0:
            raise serializers.ValidationError("limitは正の整数である必要があります。")

        # dateの検証
        date = attrs.get("date")
        if date and date > today.today():
            raise serializers.ValidationError(
                "dateは今日以前の日付でなければなりません。"
            )

        return attrs
