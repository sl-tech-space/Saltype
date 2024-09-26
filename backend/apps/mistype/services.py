from django.db import transaction
from .models import Miss
from django.db import DatabaseError
import logging

logger = logging.getLogger(__name__)

class MissTypeService:
    
    @staticmethod
    @transaction.atomic
    def insert_miss_types(user_id, miss_data):
        """ミスタイプをインサートまたは更新する処理"""
        inserted_data = []
        
        for data in miss_data:
            miss_char = data.get('miss_char')
            miss_count = data.get('miss_count', 0)

            try:
                miss_instance, created = Miss.objects.get_or_create(
                    user_id=user_id,
                    miss_char=miss_char,
                    defaults={'miss_count': miss_count}
                )

                if not created:
                    miss_instance.miss_count += miss_count
                    miss_instance.save()

                inserted_data.append({
                    'user': user_id,
                    'miss_char': miss_instance.miss_char,
                    'miss_count': miss_instance.miss_count,
                })

            except DatabaseError as e:
                logger.error(f"ミスタイプの保存中にエラーが発生しました: {e}")
                raise DatabaseError("ミスタイプの保存に失敗しました")

        return inserted_data

    @staticmethod
    def get_top_miss_types(user_id):
        """指定されたユーザーのミスタイプの上位3件を取得"""
        top_miss_types = Miss.objects.filter(user_id=user_id).order_by('-miss_count')[:3]

        if not top_miss_types:
            return None

        return top_miss_types
