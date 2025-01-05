from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class BaseSerializer(serializers.Serializer):
    def validate_existence(self, attrs, field_name, model, error_message):
        field_value = attrs.get(field_name)
        if field_value:
            try:
                attrs[field_name] = model.objects.get(pk=field_value)
            except model.DoesNotExist:
                raise ValidationError({field_name: error_message})
