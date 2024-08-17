from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import models, transaction, IntegrityError, DatabaseError

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('メールアドレスは必須入力です')
        
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('無効なメールアドレスです')
        
        email = self.normalize_email(email)
        if self.model.objects.filter(email=email).exists():
            raise ValueError('メールアドレスはすでに存在します')
        
        if password is None:
            raise ValueError('パスワードは必須入力です')
        elif len(password) < 8:
            raise ValueError('パスワードは8文字以上で入力してください')
        
        try:
            with transaction.atomic():
                user = self.model(email=email, **extra_fields)
                user.set_password(password)
                user.save(using=self._db)
        except IntegrityError as e:
            raise ValueError(f'整合性エラー：{e}')
        except DatabaseError as e:
            raise ValueError(f'データベースエラー：{e}')
        
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    user_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    rank_id = models.ForeignKey('Rank', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text=(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='customuser',
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name']

    class Meta:
        db_table = 'user'

class Rank(models.Model):
    rank_id = models.AutoField(primary_key=True)
    rank_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.rank_id} {self.rank_name}"