from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang, User, Score


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
    typing_count = serializers.IntegerField(required=False)  # タイピング数（整数）
    accuracy = serializers.FloatField(required=False)  # 精度（浮動小数点）
    score = serializers.IntegerField(required=False)  # 計算されたスコア（整数）

    def validate(self, attrs):
        """
        受け取ったデータに対してバリデーションを実行します。
        ユーザー、言語、難易度、タイピング数、精度、アクションに関する検証を行います。
        """

        # ユーザーIDの検証
        if "user_id" in attrs:
            try:
                user = User.objects.get(pk=attrs["user_id"])
                attrs["user"] = user
            except User.DoesNotExist:
                raise ValidationError({"user_id": "指定されたユーザーは存在しません。"})

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

        # タイピング数の検証（0以上）
        if "typing_count" in attrs and attrs["typing_count"] < 0:
            raise ValidationError(
                {"typing_count": "タイプ数は0以上でなければなりません。"}
            )

        # 精度の検証（0から1の間）
        if (
            "accuracy" in attrs
            and attrs["accuracy"] is not None
            and not (0 <= attrs["accuracy"] <= 1)
        ):
            raise ValidationError(
                {"accuracy": "精度は0から1の間でなければなりません。"}
            )

        # action の検証（無効なアクションの処理）
        if attrs.get("action") and attrs["action"] not in [
            "get_average_score",  # 平均スコア取得
            "get_past_scores",  # 過去のスコア取得
        ]:
            raise ValidationError("無効なアクションが指定されました。")

        return attrs
