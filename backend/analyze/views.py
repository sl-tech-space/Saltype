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
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        ミスタイプ情報を配列形式で受け取り、データベースにインサート

        :param request: 
            - miss_data: ミスタイプされた文字とその回数のリスト
            - user_id: ユーザーID
        :return: 
            成功時にステータス201とインサートされたミスタイプ情報、またはミスタイプがない場合は204を返す
        """
        
        """リクエストから miss_data（ミスタイプ情報のリスト）と user_id を取得"""
        data_list = request.data.get('miss_data', [])
        user_id = request.data.get('user_id')

        """ユーザーIDが存在しない場合はエラーを返す"""
        if not user_id:
            return Response({"error": "ユーザーIDがありません"}, status=status.HTTP_400_BAD_REQUEST)

        """ ミスタイプがない場合インサート処理をスキップ """
        if not data_list:
            return Response({"message": "ミスタイプはありませんでした"}, status=status.HTTP_204_NO_CONTENT)

        inserted_data = []
        for data in data_list:
            """各ミスタイプ情報を辞書形式で整理し、シリアライザーに渡す"""
            miss_data = {
                'user_id': user_id,
                'miss_char': data.get('miss_char'),
                'miss_count': data.get('miss_count', 0)
            }

            """ミスタイプ情報をシリアライザーでバリデーションおよび保存処理"""
            serializer = MissTypeSerializer(data=miss_data)
            if serializer.is_valid():
                serializer.save()
                inserted_data.append(serializer.data)
            else:
                """バリデーション失敗"""
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(inserted_data, status=status.HTTP_201_CREATED)