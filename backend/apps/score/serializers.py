from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang, User


class ScoreSerializer(serializers.Serializer):
    """
    スコア関連のデータをシリアライズおよびバリデーションするためのクラス。
    ユーザー、言語、難易度、タイピング数、精度などのデータを検証します。
    """

    action = serializers.ChoiceField(
        choices=[
            "get_average_score",  # 平均スコア取得
            "get_past_scores",  # 過去のスコア取得
        ],
        required=False,
    )
    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    lang_id = serializers.IntegerField()  # 言語ID（整数）
    diff_id = serializers.IntegerField()  # 難易度ID（整数）
    typing_count = serializers.IntegerField(required=False, min_value=0)  # タイピング数（整数）
    accuracy = serializers.FloatField(required=False, min_value=0, max_value=1)  # 精度（浮動小数点）
    score = serializers.IntegerField(required=False, min_value=0)  # 計算されたスコア（整数）

    def validate(self, attrs):
        """
        受け取ったデータに対してバリデーションを実行します。
        ユーザー、言語、難易度、タイピング数、精度、アクションに関する検証を行います。
        """

        # ユーザーID、言語ID、難易度IDの検証
        self._validate_existence(attrs, "user_id", User, "ユーザー")
        self._validate_existence(attrs, "lang_id", Lang, "言語")
        self._validate_existence(attrs, "diff_id", Diff, "難易度")

        # action の検証（無効なアクションの処理）
        if attrs.get("action") and attrs["action"] not in [
            "get_average_score",  # 平均スコア取得
            "get_past_scores",  # 過去のスコア取得
        ]:
            raise ValidationError("無効なアクションが指定されました。")

        return attrs

    def _validate_existence(self, attrs, field_name, model, field_label):
        """
        指定されたフィールドの存在を検証します。

        Args:
            attrs (dict): 検証対象の属性。
            field_name (str): 検証するフィールド名。
            model (Model): 検証に使用するモデル。
            field_label (str): エラーメッセージに使用するフィールドのラベル。
        """
        if field_name in attrs:
            try:
                instance = model.objects.get(pk=attrs[field_name])
                attrs[field_name[:-3]] = instance  # フィールド名から "_id" を除去して保存
            except model.DoesNotExist:
                raise ValidationError({field_name: f"指定された{field_label}は存在しません。"})
