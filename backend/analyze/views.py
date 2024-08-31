from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import t_miss, t_missana, CustomUser
from django.db.models import Count
from django.shortcuts import get_object_or_404


"""
ミスタイプをインサート（ミスタイプするたびに）
"""
def record_mistype(user_id, miss_char):
    user = get_object_or_404(CustomUser, pk=user_id)
    t_miss.objects.create(
        user_id=user,
        miss_char=miss_char
    )

"""
ミスタイプデータを分析し、ミスタイプ分析テーブルにインサート（タイピングゲーム終了したら）
"""
def analyze_mistypes(user_id):
    
    user = get_object_or_404(CustomUser, pk=user_id)

    # ミスタイプした文字ごとにグループ化してカウントを取得
    mistype_data = t_miss.objects.filter(user_id=user).values('miss_char').annotate(miss_count=Count('miss_char'))

    # ミスタイプ分析テーブルにデータをインサート
    for data in mistype_data:
        t_missana.objects.create(
            user_id=user,
            miss_char=data['miss_char'],
            miss_count=data['miss_count']
        )

    # 分析が完了したらミスタイプテーブルのデータを削除
    t_miss.objects.filter(user_id=user).delete()

"""
ミスタイプAPI
"""
@api_view(['POST'])
def record_mistype_api(request):
    user_id = request.data.get('user_id')
    miss_char = request.data.get('miss_char')

    if user_id and miss_char:
        record_mistype(user_id, miss_char)
        return Response({'status': 'success'}, status=201)
    else:
        return Response({'error': 'Missing parameters'}, status=400)

"""
ミスタイプ分析API
"""
@api_view(['POST'])
def analyze_mistypes_api(request):
    user_id = request.data.get('user_id')

    if user_id:
        analyze_mistypes(user_id)
        return Response({'status': 'success'}, status=201)
    else:
        return Response({'error': 'Missing parameters'}, status=400)
