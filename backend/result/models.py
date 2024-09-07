from django.db import models

"""
言語マスタテーブル
"""
class m_lang(models.Model):
    lang_id=models.AutoField(primary_key=True)
    lang=models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    def __str__(self):
        return self.lang

"""
難易度マスタテーブル
"""
class m_diff(models.Model):
    diff_id=models.AutoField(primary_key=True)
    diff=models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    del_flg = models.BooleanField(default=False)

    def __str__(self):
        return self.diff

class t_score(models.Model):
    """
    スコアテーブル定義

    Attributes:
        score_id (AutoField): スコアID
        user_id (ForeignKey): スコアを記録したユーザーID（CustomUserモデルへの外部キー）
        score (IntegerField): ゲームのスコア
        lang_id (ForeignKey): 言語設定（m_langモデルへの外部キー）
        diff_id (ForeignKey): 難易度設定（m_diffモデルへの外部キー）
        created_at (DateTimeField): 作成日時
        updated_at (DateTimeField): 更新日時
    
    :return: スコア
    :rtype: str
    """
    score_id=models.AutoField(primary_key=True)
    user_id=models.ForeignKey('CustomUser',on_delete=models.SET_NULL,null=True,blank=True)
    score= models.IntegerField()
    lang_id=models.ForeignKey('m_lang', on_delete=models.SET_NULL, null=True, blank=True)
    diff_id=models.ForeignKey('m_diff',on_delete=models.SET_NULL,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.score