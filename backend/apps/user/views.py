from datetime import date
from django.db import transaction
from django.http import JsonResponse
from rest_framework.response import Response

from apps.common.models import User, Score, Rank
from apps.common.util.exception_handler import HandleExceptions
from .base_view import BaseUserView


class GetUsersView(BaseUserView):
    """
    ユーザー情報全取得APIビュー
    """

    @HandleExceptions()
    def get(self, request, *args, **kwargs):
        """
        ユーザー情報を全て取得するAPI
        """
        users = User.objects.all()
        users_data = []

        for user in users:
            # 今日の最高スコアを取得する
            todays_highest_score = self.get_today_highest_score(user)

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
                }
            )

        return Response({"data": users_data}, status=200)


class GetUserView(BaseUserView):
    """
    指定したuser_idに基づくユーザー情報を取得するAPIビュー
    """

    def get(self, request, *args, **kwargs):
        """
        GETリクエストに基づいて、指定されたuser_idのユーザー情報を取得
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

        return Response({"data": user_data}, status=200)


class UpdateUserView(BaseUserView):
    """
    ユーザー情報更新APIビュー
    """

    def handle_request(self, validated_data: dict):
        """
        ユーザーの情報を更新するAPI
        """
        user_id = validated_data["user_id"]
        google_login = validated_data.get("google_login")
        password = validated_data.get("password")
        new_password = validated_data.get("new_password")

        # ユーザーIDに基づいてユーザーを取得
        user = User.objects.get(user_id=user_id)

        # ユーザー情報の更新
        user.username = validated_data.get("username", user.username)
        user.email = validated_data.get("email", user.email)

        password_updated = False

        # google_loginがTrueの場合、パスワードが存在しない場合に新しいパスワードに更新
        if google_login:
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
    ユーザー削除APIビュー
    """

    def handle_request(self, validated_data: dict):
        """
        ユーザーを削除するAPI
        """
        user = User.objects.get(user_id=validated_data["user_id"])
        user.delete()

        return {"status": "success"}
