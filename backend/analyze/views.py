from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import t_miss,t_missana
from .serializers import MissTypeSerializer
from django.db.models import Count

@api_view(['POST'])
def add_miss_type(request):
    """
    ミスタイプインサート処理

    Atributes:
        ミスタイプされるたびにミスタイプテーブルにミスタイプ文字をインサート
    :param request: 
        ミスタイプに関する情報が含まれるリクエスト（ユーザーID、ミスタイプされた文字など）
    :return: 
        成功時にステータス200とミスタイプ情報を返す
    """
    serializer = MissTypeSerializer(data=request.data)
    
    if serializer.is_valid():
        """ ミスタイプデータをインサート """
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def analyze_mistypes(request):
    """
    タイピングゲーム終了時のミスタイプ分析処理
    
    Atributes:
        1. ユーザーごとのミスタイプを集計し、分析テーブルにインサート
        2. ミスタイプ回数上位3つをフロントに返す
    :param request: 
        ユーザーIDを含むリクエストデータ
    :return: 
        ミスタイプ回数上位3つの結果
    :rtype: 
        JSON
    """
    user_id = request.data.get('user_id')

    """ ユーザーのミスタイプを集計 """
    miss_counts = t_miss.objects.filter(user_id=user_id) \
        .values('miss_char') \
        .annotate(miss_count=Count('miss_char')) \
        .order_by('-miss_count')

    """ ミスタイプ分析テーブルにインサート """
    for miss in miss_counts:
        t_missana.objects.update_or_create(
            user_id_id=user_id,
            miss_char=miss['miss_char'],
            defaults={'miss_count': miss['miss_count']}
        )

    """ ミスタイプ回数TOP3を抽出 """
    top_mistypes = miss_counts[:3]

    return Response({
        'top_mistypes': top_mistypes
    }, status=status.HTTP_200_OK)
