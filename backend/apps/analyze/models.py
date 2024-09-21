from django.db import models
from django.conf import settings

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
    miss_id=models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True) 
    miss_char=models.CharField(max_length=1)
    miss_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table="t_miss"

