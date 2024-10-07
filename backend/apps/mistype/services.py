import logging

from apps.common.utils import HandleExceptions
from django.db import transaction

from .models import Miss

logger = logging.getLogger(__name__)

class MisTypeService:

    @staticmethod
    @transaction.atomic
    @HandleExceptions()
    def insert_miss_types(user_id, miss_data):
        """ミスタイプをインサートまたは更新する処理"""
        inserted_data = []

        for data in miss_data:
            miss_char = data.get('miss_char')
            miss_count = data.get('miss_count', 0)
            """ミスタイプのインスタンスを取得または作成"""
            miss_instance, created = Miss.objects.get_or_create(user_id=user_id,
                                                                miss_char=miss_char,
                                                                defaults={'miss_count': miss_count})

            if not created:
                """既存のミスタイプの場合、カウントを更新"""
                miss_instance.miss_count += miss_count
                miss_instance.save()

            inserted_data.append({
                'user': user_id,
                'miss_char': miss_instance.miss_char,
                'miss_count': miss_instance.miss_count,
            })

        return inserted_data

    @staticmethod
    def get_misType_Top(user_id, count):
        """ミスタイプ降順取得"""
        return Miss.objects.filter(user_id=user_id).order_by('-miss_count')[:count]
