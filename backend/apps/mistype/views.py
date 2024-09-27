import logging

from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (MissDataSerializer, MissTypeSerializer, UserIDSerializer)
from .services import MissTypeService

logger = logging.getLogger(__name__)


class InsertMisTypes(APIView):
    """
    ミスタイプインサート処理
    """
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = MissTypeSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user_id = validated_data.get('user_id')
            miss_data = validated_data.get('miss_data')

            if not miss_data:
                return Response({"message": "ミスタイプはありませんでした"}, status=status.HTTP_204_NO_CONTENT)

            inserted_data = MissTypeService.insert_miss_types(user_id, miss_data)

            return Response(inserted_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetTopMissTypes(APIView):
    """
    ユーザーのミスタイプの上位3件を取得するエンドポイント
    """
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):

        serializer = UserIDSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        user_id = validated_data.get('user_id')

        top_miss_types = MissTypeService.get_top_miss_types(user_id)

        if not top_miss_types:
            return Response({"message": "ミスタイプデータは存在しません"}, status=status.HTTP_204_NO_CONTENT)

        miss_serializer = MissDataSerializer(top_miss_types, many=True)
        return Response(miss_serializer.data, status=status.HTTP_200_OK)
