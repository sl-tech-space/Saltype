from rest_framework import serializers

from apps.common.models import Score, User, Lang, Diff

class ScoreSerializer(serializers.ModelSerializer):
    """
    Scoreモデルのシリアライザークラス
    """
    
    """外部キーとして受け取るフィールド"""
    user_id = serializers.UUIDField(write_only=True)
    lang = serializers.PrimaryKeyRelatedField(queryset=Lang.objects.all())
    diff = serializers.PrimaryKeyRelatedField(queryset=Diff.objects.all())

    class Meta:
        model = Score
        """シリアライズするフィールドを指定"""
        fields = ['user_id', 'score', 'lang', 'diff']

    def create(self, validated_data):
        """
        シリアライズされたデータからScoreインスタンスを作成する
        :param validated_data: バリデーション済みのデータ
        :return: 新しく作成されたScoreインスタンス
        """
        
        """user_idからUserオブジェクトを取得"""
        user_id = validated_data.pop('user_id')
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError('User with this ID does not exist.')
        
        """バリデーション済みのデータから各フィールド取り出し"""
        lang = validated_data.pop('lang')
        diff = validated_data.pop('diff')
        
        """新しいScoreインスタンスを作成して保存"""
        return Score.objects.create(user=user, lang=lang, diff=diff, **validated_data)