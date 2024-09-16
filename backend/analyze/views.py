from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MissTypeSerializer
from rest_framework.permissions import AllowAny

class MissTypeInsertView(APIView):
    """
    ミスタイプインサート処理

    Attributes:
        POSTメソッドを使用して、ミスタイプテーブルにミスタイプ情報をインサート
    """

    """アクセス認証（全員）"""
    permission_classes = [AllowAny]  

    def post(self, request, *args, **kwargs):
        """
        ミスタイプ情報を受け取り、データベースにインサート

        :param request: 
            ミスタイプに関する情報（ユーザーID、ミスタイプ文字、ミスタイプ回数）が含まれるリクエスト
        :return: 
            成功時にステータス201とミスタイプ情報を返す
        """
        serializer = MissTypeSerializer(data=request.data)
        
        if serializer.is_valid():
            """ ミスタイプデータをインサート """
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

