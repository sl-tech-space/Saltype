import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class User(AbstractUser):
    """
    カスタムユーザモデル DBテーブル名 - m_user

    ユーザIDをUUIDとする
    ユーザ名をemailとする

    Attributes:
        user_id (UUIDField): ユーザーの一意識別子。主キーとして使用
        rank_id (ForeignKey): ランクID
        username (CharField): 一意のユーザー名。最大150文字
        email (EmailField): 一意のメールアドレス。最大254文字
        password (CharField): ハッシュ化されたパスワード。最小長のバリデーションあり
        permission (PositiveIntegerField): ユーザー権限。ADMIN(0)またはMEMBER(1)
        created_at (DateTimeField): ユーザー作成日時
        updated_at (DateTimeField): ユーザー情報最終更新日時
        del_flg (BooleanField): 削除フラグ。

    Constants:
        PERMISSON (IntegerChoices): ユーザー権限の選択肢を定義
        USERNAME_FIELD (str): 認証に使用するフィールド名。この場合は 'email'
        REQUIRED_FIELDS (list): createsuperuser コマンド実行時に要求される追加フィールド

    Meta:
        ordering (list): クエリセットのデフォルトの並び順
        db_table (str): データベーステーブル名

    Methods:
        __str__: ユーザーオブジェクトの文字列表現を返す

    Notes:
        - first_name, last_name, groups, user_permissions, last_login フィールドは使用しない
        - ユーザー作成時に自動的に認証トークンが生成される
    """

    username_validator = UnicodeUsernameValidator()

    class PERMISSON(models.IntegerChoices):
        ADMIN = 0
        MEMBER = 1

    id = None
    first_name = None
    last_name = None
    groups = None
    user_permissions = None
    last_login = None

    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rank = models.ForeignKey("Rank", on_delete=models.SET_NULL, null=True, blank=True)
    username = models.CharField(max_length=15, validators=[username_validator])
    email = models.EmailField(max_length=256, unique=True)
    password = models.CharField(max_length=100, null=True, blank=True)
    permission = models.PositiveIntegerField(
        choices=PERMISSON.choices, default=PERMISSON.MEMBER
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["username", "password"]

    class Meta:
        ordering = ["user_id"]
        db_table = "m_user"

    def __str__(self):
        return self.username


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(instance=None, created=False, **kwargs):
    """
    新規ユーザー作成時に認証トークンを自動生成する

    Args:
        instance: 作成されたユーザーインスタンス
        created (bool): オブジェクトが新規作成された場合True

    Note:
        新しいユーザーが作成されるたびに呼び出され、
        そのユーザーに対応する認証トークンを自動的に生成
    """
    if created:
        Token.objects.create(user=instance)


class Lang(models.Model):
    """
    言語マスタテーブル定義

    Attributes:
        lang_id (AutoField): 言語ID
        lang (CharField): 言語名
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
        del_flg (BooleanField): 削除フラグ

    :return: 言語
    :rtype: str
    """

    lang_id = models.AutoField(primary_key=True)
    lang = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    class Meta:
        db_table = "m_lang"


class Diff(models.Model):
    """
    難易度マスタテーブル定義

    Attributes:
        diff_id (AutoField): 難易度ID。
        diff (CharField): 難易度
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
        del_flg (BooleanField): 削除フラグ

    :return: 難易度
    :rtype: str
    """

    diff_id = models.AutoField(primary_key=True)
    diff = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    class Meta:
        db_table = "m_diff"


class Rank(models.Model):
    """
    ランクマスタテーブル定義

    Attributes:
        rank_id (AutoField): ランクID
        rank (CharField): ランク名（初期パラーメータ所持-app.py参照）
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
        del_flg (BooleanField): 削除フラグ

    Meta:
        db_table (str): データベーステーブル名
    """

    rank_id = models.AutoField(primary_key=True)
    rank = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    class Meta:
        db_table = "m_rank"


class Score(models.Model):
    """
    スコアテーブル定義

    Attributes:
        score_id (AutoField): スコアID
        user (ForeignKey): スコアを記録したユーザーID（Userモデルへの外部キー）
        score (IntegerField): ゲームのスコア（デフォルトで0）
        lang (ForeignKey): 言語設定（Langモデルへの外部キー）
        diff (ForeignKey): 難易度設定（Diffモデルへの外部キー）
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時

    Meta:
        db_table (str): データベーステーブル名
    """

    score_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    score = models.IntegerField(default=0)
    lang = models.ForeignKey("Lang", on_delete=models.SET_NULL, null=True, blank=True)
    diff = models.ForeignKey("Diff", on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_score"


class Miss(models.Model):
    """
    ミスタイプテーブル定義

    Attributes:
        miss_id (AutoField): ミスタイプID
        user (UUIDField): ユーザーID
        miss_char (CharField): ミスタイプされた文字
        miss_count (IntegerField): ミスタイプされた回数
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
    """

    miss_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    miss_char = models.CharField(max_length=1)
    miss_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_miss"


class Request(models.Model):
    """
    リクエストテーブル定義

    Attributes:
        request_id (AutoField): リクエストID
        email (EmailField): リクエストを送信したユーザーのメールアドレス
        request_content (CharField): リクエスト内容（最大256文字）
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
    """

    request_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=256)
    request_content = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_request"
