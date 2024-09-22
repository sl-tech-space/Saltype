from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .serializers import MissTypeSerializer
from apps.common.utils import CommonUtils
from .models import Miss

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
            miss_char = data.get('miss_char')
            miss_count = data.get('miss_count', 0)

            """ 既存のミスタイプを取得または作成 """
            miss_instance, created = Miss.objects.get_or_create(
                user_id=user_id,
                miss_char=miss_char,
                defaults={'miss_count': miss_count}
            )

            if not created:
                """ 既存のエントリが見つかった場合はカウントを更新 """
                miss_instance.miss_count += miss_count
                miss_instance.save()

            inserted_data.append({
                'user': user_id,
                'miss_char': miss_instance.miss_char,
                'miss_count': miss_instance.miss_count,
            })

        return Response(inserted_data, status=status.HTTP_201_CREATED)

class TopMissTypesView(APIView):
    """
    ユーザーのミスタイプの上位3件を取得するエンドポイント
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        特定のユーザーに関連するmiss_countが多い上位3件のミスタイプデータを取得

        :param request: リクエストオブジェクト
        :return: 上位3件のミスタイプデータ
        """

        """ユーザーIDをリクエストパラメータから取得"""
        user_id = request.data.get('user_id')

        """ユーザーIDが指定されていない場合はエラーを返す"""
        if not user_id:
            return Response({"error": "ユーザーIDが必要です"}, status=status.HTTP_400_BAD_REQUEST)

        """指定されたユーザーのミスタイプデータをmiss_countの降順で3件取得"""
        top_miss_types = Miss.objects.filter(user_id=user_id).order_by('-miss_count')[:3]

        """取得したデータをシリアライズ"""
        serializer = MissTypeSerializer(top_miss_types, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
