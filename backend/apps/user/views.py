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
        user_id = request.query_params.get("user_id")
        user = User.objects.get(user_id=user_id)

        # 今日の最高スコアを取得
        todays_highest_score = self.get_today_highest_score(user)
        rank_name = user.rank.rank if user.rank else None

        user_data = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "rank_name": rank_name,
            "highest_score": todays_highest_score,
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
        user = validated_data["user"]
        user.username = validated_data.get("username", user.username)
        user.email = validated_data.get("email", user.email)

        # passwordがリクエストに含まれていれば更新
        password = validated_data.get("password")
        if password:
            user.password = password
        user.save()

        return {
            "status": "success",
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
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
