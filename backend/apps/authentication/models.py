import uuid
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .validators import validate_min_length

class User(AbstractUser):
    """
    カスタムユーザモデル DBテーブル名 - m_user

    ユーザIDをUUIDとする
    ユーザ名をemailとする

    Attributes:
        user_id (UUIDField): ユーザーの一意識別子。主キーとして使用
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
    # rank_id = models.ForeignKey('Rank', on_delete=models.SET_NULL, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True, validators=[username_validator])
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=100, validators=[validate_min_length])
    permission = models.PositiveIntegerField(choices=PERMISSON.choices, default=PERMISSON.MEMBER)
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