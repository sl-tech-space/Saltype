from django.db import transaction
from .base_view import BaseUserView
from django.http import JsonResponse
from datetime import date
from apps.common.models import User, Score, Rank


class GetUserView(BaseUserView):
    """
    ユーザー情報全取得APIビュー
    """

    def get(self, request, *args, **kwargs):
        """
        ユーザー情報を全て取得するAPI
        さらに今日の最高スコアも取得して返す
        """
        users = User.objects.all()  # 全てのユーザー情報を取得
        today = date.today()  # 今日の日付を取得

        users_data = []

        for user in users:
            # ユーザーの今日のスコアを取得
            todays_score = (
                Score.objects.filter(
                    user_id=user.user_id,
                    created_at__date=today,
                )
                .order_by("-score")
                .first()
            )

            # 今日の最高スコアがある場合、それをセット
            todays_highest_score = todays_score.score if todays_score else None
            rank_name = user.rank.rank if user.rank else None

            # 最高スコアがないユーザーは除外
            if todays_highest_score is not None:
                users_data.append(
                    {
                        "user_id": user.user_id,
                        "username": user.username,
                        "email": user.email,
                        "rank_name": rank_name,
                        "highest_score": todays_highest_score,
                    }
                )

        # format_response メソッドを使ってレスポンスを整形して返す
        return Response(self.format_response({"user_data": users_data}), status=200)

    def format_response(self, users_data: list):
        """
        ユーザー情報をレスポンス形式でフォーマット。

        Args:
            users_data: ユーザー情報のリスト。
        Returns:
            dict: フォーマットされたレスポンスデータ。
        """
        return {"data": users_data}


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
