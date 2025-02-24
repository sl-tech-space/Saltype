from datetime import date
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import User, Lang, Diff


class BaseSerializer(serializers.Serializer):
    """
    基本的なバリデーションロジックを提供するシリアライザークラス。
    各種フィールド（ユーザーID、言語ID、難易度IDなど）の検証を行い、適切なエラーメッセージを返します。
    """

    def check_existence(
        self, attrs, field_name, model, error_message, object_name=None
    ):
        """
        指定されたフィールドの値がデータベースに存在するかを確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。
            field_name (str): チェックするフィールド名。
            model (Model): チェック対象のモデル。
            error_message (str): 存在しない場合のエラーメッセージ。
            object_name (str, optional): attrsに格納するオブジェクト名。デフォルトはfield_name。

        Returns:
            dict: 更新されたattrs。
        """
        field_value = attrs.get(field_name)
        if field_value is not None:
            try:
                if not model.objects.filter(pk=field_value).exists():
                    raise ValidationError({field_name: error_message})
                attrs[object_name or field_name] = model.objects.get(pk=field_value)
            except model.DoesNotExist:
                raise ValidationError({field_name: error_message})

        return attrs

    def check_user_id(self, attrs):
        """
        ユーザーIDの存在を確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:
            dict: 更新されたattrs。
        """
        return self.check_existence(
            attrs, "user_id", User, "指定されたユーザーは存在しません。", "user"
        )

    def check_lang_id(self, attrs):
        """
        言語IDの存在を確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:
            dict: 更新されたattrs。
        """
        return self.check_existence(
            attrs, "lang_id", Lang, "指定された言語は存在しません。", "lang"
        )

    def check_diff_id(self, attrs):
        """
        難易度IDの存在を確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:
            dict: 更新されたattrs。
        """
        return self.check_existence(
            attrs, "diff_id", Diff, "指定された難易度は存在しません。", "diff"
        )

    # def check_limit(self, attrs):
    #     """
    #     リミットが正の整数であるかを確認します。

    #     Args:
    #         attrs (dict): バリデーション対象のデータ。

    #     Returns:
    #         dict: 更新されたattrs。
    #     """
    #     limit = attrs.get("limit")
    #     if limit is not None and limit <= 0:
    #         raise ValidationError({"limit": "limitは正の整数である必要があります。"})
    #     return attrs

    def check_date(self, attrs):
        """
        日付が今日以前であるかを確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:
            dict: 更新されたattrs。
        """
        date_value = attrs.get("date")
        if date_value and date_value > date.today():
            raise ValidationError(
                {"date": "dateは今日以前の日付でなければなりません。"}
            )
        return attrs

    def check_action(self, attrs, valid_actions):
        """
        アクションが有効なものであるかを確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。
            valid_actions (list): 有効なアクションのリスト。

        Returns:
            dict: 更新されたattrs。
        """
        action = attrs.get("action")
        if action and action not in valid_actions:
            raise ValidationError({"action": "無効なアクションが指定されました。"})
        return attrs

    def check_email(self, attrs):
        """
        メールアドレスが存在するかを確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:
            dict: 更新されたattrs。
        """
        email = attrs.get("email")
        if not email:
            raise ValidationError({"email": "メールアドレスが必要です。"})
        return attrs

    def check_username(self, attrs):
        """
        ユーザー名が存在するかを確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:
            dict: 更新されたattrs。
        """
        username = attrs.get("username")
        if not username:
            raise ValidationError({"username": "ユーザー名が必要です。"})
        return attrs

    def check_password(self, attrs):
        """
        パスワードが正しい形式であるかを確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:    
            dict: 更新されたattrs。
        """
        password = attrs.get("password")
        if not password:
            raise ValidationError({"password": "パスワードが必要です。"})
        return attrs