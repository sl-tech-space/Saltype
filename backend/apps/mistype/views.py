from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import transaction
from .serializers import MissTypeSerializer
from apps.common.utils import CommonUtils
from rest_framework.exceptions import ValidationError
from .models import Miss
from django.db import DatabaseError
import logging

logger = logging.getLogger(__name__)

class MissTypeInsertView(APIView):
    """
    ミスタイプインサート処理

    Attributes:
        POSTメソッドを使用して、ミスタイプテーブルにミスタイプ情報をインサート
    """
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            user_id, miss_data = CommonUtils.validate_request_params(request.data, ['user_id', 'miss_data'])
        except ValidationError as e:
            logger.error(f"バリデーションエラー: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if not miss_data:
            return Response({"message": "ミスタイプはありませんでした"}, status=status.HTTP_204_NO_CONTENT)

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
                return Response({"error": "ミスタイプの保存に失敗しました"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(inserted_data, status=status.HTTP_201_CREATED)

class TopMissTypesView(APIView):
    """
    ユーザーのミスタイプの上位3件を取得するエンドポイント
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            """ リクエストのバリデーション """
            user_id = CommonUtils.validate_request_params(request.data, ['user_id'])[0]
        except ValidationError as e:
            logger.error(f"バリデーションエラー: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            """ 指定されたユーザーのミスタイプデータを取得し、miss_countの降順で上位3件を取得 """
            top_miss_types = Miss.objects.filter(user_id=user_id).order_by('-miss_count')[:3]

            """ データが存在しない場合のレスポンス """
            if not top_miss_types:
                return Response({"message": "ミスタイプデータは存在しません"}, status=status.HTTP_204_NO_CONTENT)

            """ データが存在する場合はシリアライズして返す """
            serializer = MissTypeSerializer(top_miss_types, many=True)
        except DatabaseError as e:
            logger.error(f"ミスタイプデータの取得中にエラーが発生しました: {e}")
            return Response({"error": "データの取得に失敗しました"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.data, status=status.HTTP_200_OK)
