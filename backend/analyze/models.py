from django.db import models

class Miss(models.Model):
    """
    ミスタイプテーブル定義

    Attributes:
        miss_id (AutoField): ミスタイプID
        score (ForeignKey): スコア（Scoreモデルと関連付け）
        miss_char (CharField): ミスタイプされた文字
        miss_count (IntegerField): ミスタイプされた回数
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
    """
    miss_id=models.AutoField(primary_key=True)
    # score=models.ForeignKey('Score',on_delete=models.SET_NULL,null=True,blank=True)
    user_id = models.IntegerField()
    miss_char=models.CharField(max_length=1)
    miss_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table="t_miss"

