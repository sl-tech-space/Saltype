from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang, User
from datetime import date
from apps.common.serializers import BaseSerializer


class RankingSerializer(BaseSerializer):
    """
    ランキングデータを処理するためのシリアライザクラス。
    言語ID、難易度ID、制限値、日付のバリデーションを行います。
    """

    lang_id = serializers.IntegerField()  # 言語ID
    diff_id = serializers.IntegerField()  # 難易度ID
    limit = serializers.IntegerField()  # 制限値
    date = serializers.DateField(required=False)  # 日付（オプション）

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザー、言語、難易度の存在確認、制限値と日付の検証を行います。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            dict: バリデーションを通過したデータ。
        """
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

        # 制限値の確認
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError("limitは正の整数である必要があります。")

        # 日付の確認
        date_value = attrs.get("date")
        if date_value and date_value > date.today():
            raise ValidationError("dateは今日以前の日付でなければなりません。")

        return attrs
