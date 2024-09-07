from django.db import models


class t_miss(models.Model):
    """
    ミスタイプテーブル定義

    Attributes:
        miss_id (AutoField): 各ミスタイプの一意の識別子。
        user_id (ForeignKey): ユーザーを表す外部キー（CustomUserモデルと関連付け）。
        miss_char (CharField): ミスタイプされた文字を表す文字列（1文字）。
        created_at (DateTimeField): ミスタイプが記録された日時。
        updated_at (DateTimeField): 最後にミスタイプが更新された日時。
    
    :return: なし
    :rtype: なし
    """
    miss_id=models.AutoField(primary_key=True)
    user_id=models.ForeignKey('CustomUser',on_delete=models.SET_NULL,null=True,blank=True)
    miss_char=models.CharField(max_length=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class t_missana(models.Model):
    """
    ミスタイプ分析テーブル定義

    Attributes:
        miss_id (AutoField): 各ミスタイプ分析の一意の識別子。
        user_id (ForeignKey): ユーザーを表す外部キー（CustomUserモデルと関連付け）。
        miss_char (CharField): 分析されたミスタイプの文字（1文字）。
        miss_count (IntegerField): ミスタイプされた回数を記録。
        created_at (DateTimeField): 分析が記録された日時。
        updated_at (DateTimeField): 最後に分析が更新された日時。
    
    :return: なし
    :rtype: なし
    """
    miss_id=models.AutoField(primary_key=True)
    user_id=models.ForeignKey('CustomUser',on_delete=models.SET_NULL,null=True,blank=True)
    miss_char=models.CharField(max_length=1)
    miss_count=models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
