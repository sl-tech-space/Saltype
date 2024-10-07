import logging

from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MissTypeSerializer, UserIDSerializer
from .services import MisTypeService

logger = logging.getLogger(__name__)


class InsertMisTypes(APIView):
    """ミスタイプインサート処理"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """リクエストから送信されたデータをもとにシリアライズインスタンス作成"""
        serializer = MissTypeSerializer(data=request.data)
        if serializer.is_valid():
            """有効データの取得"""
            validated_data = serializer.validated_data
            user_id = validated_data['user_id']
            miss_data = validated_data['miss_data']

            inserted_data = MisTypeService.insert_miss_types(user_id, miss_data)
            return Response(inserted_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetTopMissTypes(APIView):
    """ユーザーのミスタイプの上位N件を取得"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """リクエストから送信されたデータをもとにシリアライズインスタンス作成"""
        serializer = UserIDSerializer(data=request.data)
        if serializer.is_valid():
            """有効データの取得"""
            user_id = serializer.validated_data['user_id']
            count = serializer.validated_data['count']
            """ミスタイプ降順取得処理"""
            miss_chars = MisTypeService.get_misType_Top(user_id, count)

            if not miss_chars.exists():
                return Response({"message": "指定されたユーザーに関連するミスタイプは存在しません"},
                                status=status.HTTP_204_NO_CONTENT)

            miss_chars_data = [{
                "miss_char": miss.miss_char,
                "miss_count": miss.miss_count
            } for miss in miss_chars]
            return Response(miss_chars_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
