from apps.common.models import Diff, Lang, Rank, User
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class ScoreSerializer(serializers.Serializer):
    """
    スコア関連のデータをシリアライズおよびバリデーションするためのクラス。
    """
    user_id = serializers.UUIDField(required=False)  # ユーザーID（UUID形式）
    lang_id = serializers.IntegerField(required=False)  # 言語ID（整数）
    diff_id = serializers.IntegerField(required=False)  # 難易度ID（整数）
    typing_count = serializers.IntegerField(required=False)  # タイピング数（整数）
    accuracy = serializers.FloatField(required=False)  # 精度（浮動小数点）
    score = serializers.IntegerField(required=False)  # 計算されたスコア（整数）

    def validate(self, attrs):
        """
        受け取ったデータに対してバリデーションを実行。
        
        Args:
            attrs: シリアライズされるデータの辞書。
        
        Returns:
            attrs: バリデーション後のデータ（エラーがなければそのまま返却）。
        
        Raises:
            ValidationError: バリデーションエラーがあった場合に発生。
        """
        # ユーザーIDが指定されている場合、ユーザーオブジェクトを取得
        if "user_id" in attrs:
            user = get_object_or_404(User, pk=attrs["user_id"])
            attrs["user"] = user

        # 言語IDが指定されている場合、言語オブジェクトを取得
        if "lang_id" in attrs:
            lang = get_object_or_404(Lang, pk=attrs["lang_id"])
            attrs["lang"] = lang

        # 難易度IDが指定されている場合、難易度オブジェクトを取得
        if "diff_id" in attrs:
            diff = get_object_or_404(Diff, pk=attrs["diff_id"])
            attrs["diff"] = diff

        # タイピング数が指定されており、0未満であればエラー
        if "typing_count" in attrs and attrs["typing_count"] < 0:
            raise ValidationError({"typing_count": "タイプ数は0以上でなければなりません。"})

        # 精度が指定されており、0から1の範囲外であればエラー
        if "accuracy" in attrs and not (0 <= attrs["accuracy"] <= 1):
            raise ValidationError({"accuracy": "精度は0から1の間でなければなりません。"})

        return attrs

    def get_rank_id(self, rank_name):
        """
        ランク名からランクIDを取得するメソッド。
        
        ランク名に対応するランクIDをデータベースから取得し、返します。
        
        Args:
            rank_name: ランクの名前（文字列）。
        
        Returns:
            int: 対応するランクのID。
        
        Raises:
            Http404: ランク名が存在しない場合、404エラーを発生させます。
        """
        # ランク名に対応するランクオブジェクトをデータベースから取得
        rank = get_object_or_404(Rank, rank=rank_name)
        return rank.rank_id
