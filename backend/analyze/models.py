from django.db import models

class Miss(models.Model):
    """
    ミスタイプテーブル定義

    Attributes:
        miss_id (AutoField): ミスタイプID
        user_id (ForeignKey): ユーザーを表すS外部キー（CustomUserモデルと関連付け）
        miss_char (CharField): ミスタイプされた文字を表す文字列（1文字）
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
    """
    miss_id=models.AutoField(primary_key=True)
    user_id=models.ForeignKey('CustomUser',on_delete=models.SET_NULL,null=True,blank=True)
    miss_char=models.CharField(max_length=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
class missana(models.Model):
    """
    ミスタイプ分析テーブル定義

    Attributes:
        miss_id (AutoField): ミスタイプ分析ID
        user_id (ForeignKey): ユーザーを表す外部キー（CustomUserモデルと関連付け）
        miss_char (CharField): 分析されたミスタイプの文字（1文字）
        miss_count (IntegerField): ミスタイプされた回数
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
    """
    miss_id=models.AutoField(primary_key=True)
    user_id=models.ForeignKey('CustomUser',on_delete=models.SET_NULL,null=True,blank=True)
    miss_char=models.CharField(max_length=1)
    miss_count=models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table="t_missana"
