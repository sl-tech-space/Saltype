import logging

from apps.common.utils import CommonUtils, HandleExceptions
from django.db import DatabaseError, transaction
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Miss
from .serializers import MissTypeSerializer
from .services import MissTypeService

logger = logging.getLogger(__name__)


class InsertMisTypes(APIView):
    """
    ミスタイプインサート処理
    """
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        user_id, miss_data = CommonUtils.validate_request_params(request.data,
                                                                 ['user_id', 'miss_data'])

        if not miss_data:
            return Response({"message": "ミスタイプはありませんでした"}, status=status.HTTP_204_NO_CONTENT)

        # サービス層でミスタイプをインサート/更新
        inserted_data = MissTypeService.insert_miss_types(user_id, miss_data)

        return Response(inserted_data, status=status.HTTP_201_CREATED)


class GetTopMissTypes(APIView):
    """
    ユーザーのミスタイプの上位3件を取得するエンドポイント
    """
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        user_id = CommonUtils.validate_request_params(request.data, ['user_id'])[0]

        # サービス層で上位3件のミスタイプを取得
        top_miss_types = MissTypeService.get_top_miss_types(user_id)

        if not top_miss_types:
            return Response({"message": "ミスタイプデータは存在しません"}, status=status.HTTP_204_NO_CONTENT)

        # シリアライズしてレスポンス
        serializer = MissTypeSerializer(top_miss_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
