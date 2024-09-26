from django.core.exceptions import ValidationError


def validate_min_length(value, min_length=8):
    """
    パスワードのバリデーション - 8文字以上
    """
    if len(value) < min_length:
        raise ValidationError(f"パスワードは{ min_length }文字以上で入力してください。入力値：{value}文字")
