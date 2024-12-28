from django.db import transaction
from .base_view import BaseUserView
from django.http import JsonResponse
from datetime import date
from apps.common.models import User, Score, Rank

from apps.common.util.exception_handler import HandleExceptions
from rest_framework.response import Response
from datetime import date
from apps.common.models import Score


class GetUsersView(BaseUserView):
    """
    ユーザー情報全取得APIビュー
    """

    @HandleExceptions()
    def get(self, request, *args, **kwargs):
        """
        ユーザー情報を全て取得するAPI
        さらに今日の最高スコアも取得して返す
        """
        users = User.objects.all()  # 全てのユーザー情報を取得
        users_data = []

        for user in users:
            # 今日の最高スコアを取得する
            todays_highest_score = self.get_today_highest_score(user)
            rank_name = user.rank.rank if user.rank else None

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

    def get_today_highest_score(self, user):
        """
        ユーザーの今日の最高スコアを取得するメソッド。

        Args:
            user: ユーザーオブジェクト
        Returns:
            int or None: 今日の最高スコア（なければNone）
        """
        today = date.today()

        # ユーザーの今日の最高スコアを取得
        todays_score = (
            Score.objects.filter(
                user_id=user.user_id,
                created_at__date=today,
            )
            .order_by("-score")
            .first()
        )

        if todays_score:
            return todays_score.score
        else:
            return None


class GetUserView(BaseUserView):
    """
    指定したuser_idに基づくユーザー情報を取得するAPIビュー
    """

    def handle_request(self, validated_data: dict):
        user_id = validated_data["user_id"]
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

        return user_data

    def get_today_highest_score(self, user):
        """
        ユーザーの今日の最高スコアを取得するメソッド。

        Args:
            user: ユーザーオブジェクト
        Returns:
            int or None: 今日の最高スコア（なければNone）
        """
        today = date.today()

        # ユーザーの今日の最高スコアを取得
        todays_score = (
            Score.objects.filter(
                user_id=user.user_id,
                created_at__date=today,
            )
            .order_by("-score")
            .first()
        )

        if todays_score:
            return todays_score.score
        else:
            return None


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
        user.password = validated_data.get("password", user.password)
        user.save()

        # 更新したユーザー情報を返す
        return {
            "status": "success",
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "password": user.password,
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
