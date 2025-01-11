from rest_framework.response import Response

from apps.common.models import User, Rank
from .base_view import BaseUserView


class GetUsersView(BaseUserView):
    """
    ユーザー情報全取得APIビュークラス。
    すべてのユーザー情報を取得し、レスポンスとして返します。
    """

    def handle_get_request(self, *args, **kwargs):
        """
        ユーザー情報を全て取得するGETリクエストを処理します。

        Returns:
            dict: ユーザー情報を含むレスポンスデータ。
        """
        users = User.objects.all()
        users_data = []

        for user in users:
            # 今日の最高スコアを取得する
            todays_highest_score = self.get_today_highest_score(user)

            # パスワードの存在有無を確認（NULLかどうかをチェック）
            password_exists = user.password is not None

            # ランク情報を個別に取得
            rank_name = None
            if user.rank_id:
                rank = Rank.objects.get(rank_id=user.rank_id)
                rank_name = rank.rank

            users_data.append(
                {
                    "user_id": user.user_id,
                    "username": user.username,
                    "email": user.email,
                    "rank_name": rank_name,
                    "highest_score": todays_highest_score,
                    "password_exists": password_exists,
                }
            )

        return {"data": users_data}


class GetUserView(BaseUserView):
    """
    指定したuser_idに基づくユーザー情報を取得するAPIビュークラス。
    """

    def handle_get_request(self, *args, **kwargs):
        """
        指定されたuser_idのユーザー情報を取得するGETリクエストを処理します。

        Returns:
            dict: 指定されたユーザー情報を含むレスポンスデータ。
        """
        user_id = kwargs.get("user_id")
        user = User.objects.get(user_id=user_id)

        # パスワードの存在有無を確認（NULLかどうかをチェック）
        password_exists = user.password is not None

        # 今日の最高スコアを取得
        todays_highest_score = self.get_today_highest_score(user)
        rank_name = user.rank.rank if user.rank else None

        user_data = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "permission": user.permission,
            "rank_name": rank_name,
            "highest_score": todays_highest_score,
            "password_exists": password_exists,
        }

        return {"data": user_data}


class UpdateUserView(BaseUserView):
    """
    ユーザー情報更新APIビュークラス。
    ユーザーの情報を更新します。
    """

    def handle_post_request(self, validated_data: dict):
        """
        ユーザーの情報を更新するリクエストを処理します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 更新結果を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        google_login = validated_data.get("google_login")
        password = validated_data.get("password")
        new_password = validated_data.get("new_password")

        # ユーザーIDに基づいてユーザーを取得
        user = User.objects.get(user_id=user_id)

        # ユーザー名とメールアドレスの更新
        user.username = validated_data.get("username", user.username)
        user.email = validated_data.get("email", user.email)

        password_updated = False

        # パスワードの更新処理
        if new_password:
            if google_login:
                # google_loginがTrueの場合、パスワードが存在しない場合に新しいパスワードに更新
                if not user.password:
                    user.set_password(new_password)
                    password_updated = True
            else:
                # google_loginがFalseの場合、現在のパスワードが一致するか確認し、新しいパスワードに更新
                if user.check_password(password):
                    user.set_password(new_password)
                    password_updated = True

        # 変更を保存
        user.save()

        return {
            "status": "success",
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "password_updated": password_updated,
        }


class DeleteUserView(BaseUserView):
    """
    ユーザー削除APIビュークラス。
    指定されたユーザーを削除します。
    """

    def handle_post_request(self, validated_data: dict):
        """
        ユーザーを削除するリクエストを処理します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 削除結果を含むレスポンスデータ。
        """
        user = User.objects.get(user_id=validated_data["user_id"])
        user.delete()

        return {"status": "success"}
