from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import User, Lang, Diff


class BaseSerializer(serializers.Serializer):
    def validate_existence(self, attrs, field_name, model, error_message, object_name=None):
        field_value = attrs.get(field_name)
        if field_value is not None:
            try:
                obj = model.objects.get(pk=field_value)
                attrs[object_name or field_name] = obj
            except model.DoesNotExist:
                raise ValidationError({field_name: error_message})
        return attrs

    def check_user_id(self, attrs):
        return self.validate_existence(attrs, "user_id", User, "指定されたユーザーは存在しません。", object_name="user")

    def check_lang_id(self, attrs):
        return self.validate_existence(attrs, "lang_id", Lang, "指定された言語は存在しません。", object_name="lang")

    def check_diff_id(self, attrs):
        return self.validate_existence(attrs, "diff_id", Diff, "指定された難易度は存在しません。", object_name="diff")