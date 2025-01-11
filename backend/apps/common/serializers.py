from datetime import date
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import User, Lang, Diff


class BaseSerializer(serializers.Serializer):
    # モデルの存在を確認する汎用メソッド
    def check_existence(
        self, attrs, field_name, model, error_message, object_name=None
    ):
        field_value = attrs.get(field_name)
        if field_value is None:
            return attrs
        try:
            # 指定されたフィールドの値でオブジェクトを取得
            obj = model.objects.get(pk=field_value)
            # オブジェクトを属性に追加
            attrs[object_name or field_name] = obj
        except model.DoesNotExist:
            # オブジェクトが存在しない場合はエラーを発生
            raise ValidationError({field_name: error_message})
        return attrs

    # ユーザーIDの存在を確認
    def check_user_id(self, attrs):
        return self.check_existence(
            attrs, "user_id", User, "指定されたユーザーは存在しません。", "user"
        )

    # 言語IDの存在を確認
    def check_lang_id(self, attrs):
        return self.check_existence(
            attrs, "lang_id", Lang, "指定された言語は存在しません。", "lang"
        )

    # 難易度IDの存在を確認
    def check_diff_id(self, attrs):
        return self.check_existence(
            attrs, "diff_id", Diff, "指定された難易度は存在しません。", "diff"
        )

    # limitの値を確認
    def check_limit(self, attrs):
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            # limitが正の整数でない場合はエラーを発生
            raise ValidationError({"limit": "limitは正の整数である必要があります。"})
        return attrs

    # 日付の値を確認
    def check_date(self, attrs):
        date_value = attrs.get("date")
        if date_value and date_value > date.today():
            # 日付が今日以前でない場合はエラーを発生
            raise ValidationError(
                {"date": "dateは今日以前の日付でなければなりません。"}
            )
        return attrs

    # アクションの値を確認
    def check_action(self, attrs, valid_actions):
        action = attrs.get("action")
        if action and action not in valid_actions:
            # 無効なアクションが指定された場合はエラーを発生
            raise ValidationError({"action": "無効なアクションが指定されました。"})
        return attrs

    # ミスタイプの形式を確認
    def check_mistypes(self, attrs):
        mistypes = attrs.get("mistypes", [])
        if not isinstance(mistypes, list):
            # mistypesがリストでない場合はエラーを発生
            raise ValidationError(
                {"mistypes": "mistypesはリスト形式である必要があります。"}
            )
        for item in mistypes:
            if (
                not isinstance(item, dict)
                or not isinstance(item.get("miss_count"), int)
                or item.get("miss_count") < 0
            ):
                # 各ミスタイプに正の整数のmiss_countがない場合はエラーを発生
                raise ValidationError(
                    {"mistypes": "各ミスタイプには正の整数のmiss_countが必要です。"}
                )
        return attrs

    # メールアドレスの存在を確認
    def check_email(self, attrs):
        email = attrs.get("email")
        if not email:
            # メールアドレスがない場合はエラーを発生
            raise ValidationError({"email": "メールアドレスが必要です。"})
        return attrs

    # パスワードの長さを確認
    def check_password(self, attrs, min_length=8):
        password = attrs.get("password")
        if password and len(password) < min_length:
            # パスワードが指定された長さ未満の場合はエラーを発生
            raise ValidationError(
                {
                    "password": f"パスワードは{min_length}文字以上で入力してください。入力値：{len(password)}文字"
                }
            )
        return attrs
