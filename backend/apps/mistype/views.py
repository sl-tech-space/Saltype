import logging

from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MissTypeSerializer, UserIDSerializer
from .services import MistypeService

logger = logging.getLogger(__name__)


class InsertMisTypes(APIView):
    """ミスタイプインサート処理"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = MissTypeSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user_id = validated_data['user_id']
            miss_data = validated_data['miss_data']
            """インスタンスを作成してからメソッドを呼び出す"""
            mistype_service = MistypeService()
            inserted_data = mistype_service.insert_mistypes(user_id, miss_data)
            return Response(inserted_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetTopMisTypes(APIView):
    """ユーザーのミスタイプ上位N件を取得"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = UserIDSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            count = serializer.validated_data['count']
            """インスタンスを作成してからメソッドを呼び出す"""
            mistype_service = MistypeService()
            miss_chars = mistype_service.get_topmisstypes(user_id, count)

            if not miss_chars.exists():
                return Response({"message": "指定されたユーザーに関連するミスタイプは存在しません"},
                                status=status.HTTP_204_NO_CONTENT)

            miss_chars_data = [{
                "miss_char": miss.miss_char,
                "miss_count": miss.miss_count
            } for miss in miss_chars]
            return Response(miss_chars_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
