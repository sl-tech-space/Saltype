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
        db_table = "user"
        
    def __str__(self):
        return self.username

# ユーザー作成時に自動的にトークンを生成
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)