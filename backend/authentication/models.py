import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
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
    # is_staff = None
    # is_active = None
    # is_superuser = None
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
        db_table = "User"
        
    def __str__(self):
        return self.username