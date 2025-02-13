from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from apps.common.models import User, Rank
import uuid
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
        users = User.objects.filter(del_flg=False)
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
        # del_flgがFalseのユーザーのみを取得
        user = User.objects.get(user_id=user_id, del_flg=False)
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
    ユーザー論理削除APIビュークラス。
    指定されたユーザーを論理削除します。
    """

    def handle_delete_request(self, validated_data: dict):

        user_id = validated_data["user_id"]
        # ユーザーを論理削除
        user = User.objects.get(user_id=user_id)
        user.del_flg = True
        user.save()

        return {"status": "success"}


# class PasswordResetView(BaseUserView):
#     """
#     パスワードリセットを処理するビュークラス。
#     1つのビューでリセットリクエストとリセット確認フォームを管理。
#     """

#     def handle_post_request(self, validated_data):
#         """
#         POSTリクエストを処理します。
#         トークンがある場合はパスワードリセットを実行し、トークンがない場合はリセットメールを送信します。
#         """
#         token = validated_data.get("token")  # トークンを取得
#         if token:
#             return self.handle_reset_password(token, validated_data)
#         else:
#             return self.handle_password_reset_request(validated_data)

#     def handle_get_request(self, *args, **kwargs):
#         """
#         GETリクエストでフォームを表示します。
#         トークンがある場合はリセットフォームを表示、なければリセットリクエストフォームを表示します。
#         """
#         token = kwargs.get("token")
#         if token:
#             if self.is_token_valid(token):
#                 # トークンが有効なら、画面遷移なしで処理
#                 return {
#                     "message": "トークンが有効です。パスワードリセットフォームを表示します。"
#                 }
#             else:
#                 return {"message": "無効なトークンです", "status": 400}

#         # トークンがない場合
#         return {
#             "message": "パスワードリセットリクエストフォームを表示します。"
#         }

#     def handle_password_reset_request(self, validated_data):
#         """
#         パスワードリセットリクエストを処理します。
#         メールアドレスにパスワードリセット用のトークン付きURLを送信します。
#         """
#         email = validated_data["email"]
#         try:
#             user = User.objects.get(email=email)
#             token = self.create_password_reset_token(user)  # トークンを生成
#             self.send_password_reset_email(user, token)  # メールを送信
#         except User.DoesNotExist:
#             pass  # ユーザーが見つからなくてもエラーを出さず進める

#         return {"message": "パスワードリセット用のリンクが送信されました。"}

#     def handle_reset_password(self, token, validated_data):
#         """
#         パスワードリセットを処理します。
#         トークンが有効であれば新しいパスワードを設定します。
#         """
#         if not self.is_token_valid(token):
#             return {"message": "トークンの有効期限が切れています", "status": 400}

#         new_password = validated_data.get("new_password")
#         confirm_password = validated_data.get("confirm_password")

#         # 新しいパスワードの確認
#         if confirm_password != new_password:
#             return {"message": "パスワードが一致しません", "status": 400}

#         user = self.get_user_from_token(token)
#         user.set_password(new_password)
#         user.save()

#         # トークンを無効化
#         self.invalidate_token(token)

#         return {"message": "パスワードがリセットされました。"}

#     def create_password_reset_token(self, user):
#         """
#         パスワードリセット用のランダムなトークンを生成し、キャッシュに保存します。
#         """
#         token = uuid.uuid4().hex
#         expiration_time = timezone.now() + timedelta(minutes=10)  # トークンの有効期限は10分
#         cache.set(
#             token, {"user_id": user.id, "expires_at": expiration_time}, timeout=600
#         )  # キャッシュに保持
#         return token

#     def send_password_reset_email(self, user, token):
#         """
#         パスワードリセット用のURLをメールで送信します。
#         """
#         # フロントエンドでパスワードリセットを処理するためのURLを生成
#         token_url = reverse("password_reset", args=[token])  # トークン付きURLを生成
#         full_url = f"{settings.SITE_URL}{token_url}"  # サイトのURLと組み合わせて完全なURLを作成

#         subject = "パスワードリセットのリクエスト"
        
#         # メールの本文にHTMLとしてURLを埋め込む
#         message = f"""
#         <html>
#             <body>
#                 <p>こんにちは {user.username}さん、</p>
#                 <p>パスワードリセットのリクエストがありました。</p>
#                 <p>以下のリンクをクリックして、新しいパスワードを設定してください：</p>
#                 <p><a href="{full_url}">パスワードリセットリンク</a></p>
#             </body>
#         </html>
#         """

#         send_mail(
#             subject,
#             message,
#             settings.EMAIL_HOST_USER,
#             [user.email],
#             html_message=message  # HTMLメールとして送信
#         )

#     def is_token_valid(self, token):
#         """
#         トークンが有効かどうかを確認します。
#         有効な場合はTrue、無効な場合はFalseを返します。
#         """
#         token_data = cache.get(token)
#         if not token_data:
#             return False

#         if timezone.now() > token_data["expires_at"]:
#             self.invalidate_token(token)
#             return False

#         return True

#     def get_user_from_token(self, token):
#         """
#         トークンからユーザーを取得します。
#         """
#         token_data = cache.get(token)
#         if not token_data:
#             return None

#         return User.objects.get(id=token_data["user_id"])

#     def invalidate_token(self, token):
#         """
#         トークンを無効化します（キャッシュから削除）。
#         """
#         cache.delete(token)

class PasswordResetView(BaseUserView):
    """
    パスワードリセットを処理するビュークラス。
    1つのビューでリセットリクエストとリセット確認フォームを管理。
    """

    def handle_post_request(self, validated_data):
        """
        POSTリクエストを処理します。
        トークンがある場合はパスワードリセットを実行し、トークンがない場合はリセットメールを送信します。
        """
        token = validated_data.get("token")  # トークンを取得
        if token:
            return self.handle_reset_password(token, validated_data)
        else:
            return self.handle_password_reset_request(validated_data)

    def handle_get_request(self, *args, **kwargs):
        """
        GETリクエストでフォームを表示します。
        トークンがある場合はリセットフォームを表示、なければリセットリクエストフォームを表示します。
        """
        token = kwargs.get("token")
        if token:
            # トークン検証リクエストを明示的に呼び出す
            return self.handle_token_validation_request(token)

        # トークンがない場合
        return {
            "message": "パスワードリセットリクエストフォームを表示します。"
        }

    def handle_token_validation_request(self, token):
        """
        トークンの有効性を検証するリクエスト。
        ここでトークンが有効か無効かを返す。
        """
        if self.is_token_valid(token):
            return {
                "message": "トークンが有効です。パスワードリセットフォームを表示します。"
            }
        else:
            return {"message": "無効なトークンです", "status": 400}

    def handle_password_reset_request(self, validated_data):
        """
        パスワードリセットリクエストを処理します。
        メールアドレスにパスワードリセット用のトークン付きURLを送信します。
        """
        email = validated_data["email"]
        try:
            user = User.objects.get(email=email)
            token = self.create_password_reset_token(user)  # トークンを生成
            self.send_password_reset_email(user, token)  # メールを送信
        except User.DoesNotExist:
            pass  # ユーザーが見つからなくてもエラーを出さず進める

        return {"message": "パスワードリセット用のリンクが送信されました。"}

    def handle_reset_password(self, token, validated_data):
        """
        パスワードリセットを処理します。
        トークンが有効であれば新しいパスワードを設定します。
        """
        if not self.is_token_valid(token):
            return {"message": "トークンの有効期限が切れています", "status": 400}

        new_password = validated_data.get("new_password")
        confirm_password = validated_data.get("confirm_password")

        # 新しいパスワードの確認
        if confirm_password != new_password:
            return {"message": "パスワードが一致しません", "status": 400}

        user = self.get_user_from_token(token)
        user.set_password(new_password)
        user.save()

        # トークンを無効化
        self.invalidate_token(token)

        return {"message": "パスワードがリセットされました。"}

    def create_password_reset_token(self, user):
        """
        パスワードリセット用のランダムなトークンを生成し、キャッシュに保存します。
        """
        token = uuid.uuid4().hex
        expiration_time = timezone.now() + timedelta(minutes=10)  # トークンの有効期限は10分
        cache.set(
            token, {"user_id": user.id, "expires_at": expiration_time}, timeout=600
        )  # キャッシュに保持
        return token

    def send_password_reset_email(self, user, token):
        """
        パスワードリセット用のURLをメールで送信します。
        """
        # フロントエンドでパスワードリセットを処理するためのURLを生成
        token_url = reverse("password_reset", args=[token])  # トークン付きURLを生成
        full_url = f"{settings.SITE_URL}{token_url}"  # サイトのURLと組み合わせて完全なURLを作成

        subject = "パスワードリセットのリクエスト"
        
        # メールの本文にHTMLとしてURLを埋め込む
        message = f"""
        <html>
            <body>
                <p>こんにちは {user.username}さん、</p>
                <p>パスワードリセットのリクエストがありました。</p>
                <p>以下のリンクをクリックして、新しいパスワードを設定してください：</p>
                <p><a href="{full_url}">パスワードリセットリンク</a></p>
            </body>
        </html>
        """

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [user.email],
            html_message=message  # HTMLメールとして送信
        )

    def is_token_valid(self, token):
        """
        トークンが有効かどうかを確認します。
        有効な場合はTrue、無効な場合はFalseを返します。
        """
        token_data = cache.get(token)
        if not token_data:
            return False

        if timezone.now() > token_data["expires_at"]:
            self.invalidate_token(token)
            return False

        return True

    def get_user_from_token(self, token):
        """
        トークンからユーザーを取得します。
        """
        token_data = cache.get(token)
        if not token_data:
            return None

        return User.objects.get(id=token_data["user_id"])

    def invalidate_token(self, token):
        """
        トークンを無効化します（キャッシュから削除）。
        """
        cache.delete(token)

#TODO実装

# class PasswordResetConfirmView(BaseUserView):
#     """
#     パスワードリセット確認を処理するビュークラス。
#     トークンと新しいパスワードを受け取り、パスワードリセットを実行します。
#     """

#     def handle_post_request(self, validated_data):
#         """
#         POSTリクエストで新しいパスワードを設定します。
#         トークンを検証し、パスワードの一致を確認してリセットします。
#         """
#         token = validated_data.get("token")  # トークンを取得
#         new_password = validated_data.get("new_password")
#         confirm_password = validated_data.get("confirm_password")

#         # パスワードの一致確認
#         if new_password != confirm_password:
#             return {"message": "パスワードが一致しません", "status": 400}

#         if not self.is_token_valid(token):
#             return {"message": "トークンの有効期限が切れています", "status": 400}

#         # トークンからユーザーを取得
#         user = self.get_user_from_token(token)
#         if not user:
#             return {"message": "無効なトークンです", "status": 400}

#         # 新しいパスワードを設定
#         user.set_password(new_password)
#         user.save()

#         # トークン無効化
#         self.invalidate_token(token)

#         # パスワードリセット成功の通知メールを送信
#         self.send_password_reset_success_email(user)

#         return {"message": "パスワードがリセットされました。"}


#     def send_password_reset_success_email(self, user):
#         """
#         パスワードリセット成功の通知メールを送信します。
#         """
#         subject = "パスワードリセット完了"

#         message = f"""
#         <html>
#             <body>
#                 <p>こんにちは {user.username}さん、</p>
#                 <p>パスワードが正常にリセットされました。</p>
#                 <p>以下のリンクからログインできます：</p>
#                 <p><a href="{settings.LOGIN_URL}">ログイン画面</a></p>
#             </body>
#         </html>
#         """

#         send_mail(
#             subject,
#             message,
#             settings.EMAIL_HOST_USER,
#             [user.email],
#             html_message=message  # HTMLメールとして送信
#         )

