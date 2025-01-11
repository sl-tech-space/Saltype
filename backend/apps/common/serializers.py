from datetime import date
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import User, Lang, Diff

class BaseSerializer(serializers.Serializer):
    def check_existence(self, attrs, field_name, model, error_message, object_name=None):
        field_value = attrs.get(field_name)
        if field_value is None:
            return attrs
        try:
            obj = model.objects.get(pk=field_value)
            attrs[object_name or field_name] = obj
        except model.DoesNotExist:
            raise ValidationError({field_name: error_message})
        return attrs

    def check_user_id(self, attrs):
        return self.check_existence(attrs, "user_id", User, "指定されたユーザーは存在しません。", "user")

    def check_lang_id(self, attrs):
        return self.check_existence(attrs, "lang_id", Lang, "指定された言語は存在しません。", "lang")

    def check_diff_id(self, attrs):
        return self.check_existence(attrs, "diff_id", Diff, "指定された難易度は存在しません。", "diff")

    def check_limit(self, attrs):
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError({"limit": "limitは正の整数である必要があります。"})
        return attrs

    def check_date(self, attrs):
        date_value = attrs.get("date")
        if date_value and date_value > date.today():
            raise ValidationError({"date": "dateは今日以前の日付でなければなりません。"})
        return attrs

    def check_action(self, attrs, valid_actions):
        action = attrs.get("action")
        if action and action not in valid_actions:
            raise ValidationError({"action": "無効なアクションが指定されました。"})
        return attrs

    def check_mistypes(self, attrs):
        mistypes = attrs.get("mistypes", [])
        if not isinstance(mistypes, list):
            raise ValidationError({"mistypes": "mistypesはリスト形式である必要があります。"})
        for item in mistypes:
            if not isinstance(item, dict) or not isinstance(item.get("miss_count"), int) or item.get("miss_count") < 0:
                raise ValidationError({"mistypes": "各ミスタイプには正の整数のmiss_countが必要です。"})
        return attrs

    def check_email(self, attrs):
        email = attrs.get("email")
        if not email:
            raise ValidationError({"email": "メールアドレスが必要です。"})
        return attrs

    def check_password(self, attrs, min_length=8):
        password = attrs.get("password")
        if password and len(password) < min_length:
            raise ValidationError({"password": f"パスワードは{min_length}文字以上で入力してください。入力値：{len(password)}文字"})
        return attrs