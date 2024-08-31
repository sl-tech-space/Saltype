# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Rank, t_score, CustomUser, m_lang, m_diff

"""
スコアをインサートするAPIエンドポイント
"""
@api_view(['POST'])
def insert_score_api(request):
    user_id = request.data.get('user_id')
    score = request.data.get('score')
    lang_id = request.data.get('lang_id')
    diff_id = request.data.get('diff_id')

    if not (user_id and score and lang_id and diff_id):
        return Response({'error': 'Missing required parameters'}, status=400)

    """外部キーに関連するオブジェクトを取得"""
    user = get_object_or_404(CustomUser, pk=user_id) if user_id else None
    lang = get_object_or_404(m_lang, pk=lang_id) if lang_id else None
    diff = get_object_or_404(m_diff, pk=diff_id) if diff_id else None

    """ユーザーの過去最高スコア取得"""
    previous_best_score = t_score.objects.filter(user_id=user).order_by('-score').first()

    """新記録かどうか判定"""
    is_new_record = previous_best_score is None or score > previous_best_score.score

    """スコアをデータベースにインサート"""
    new_score = t_score.objects.create(
        user_id=user,
        score=score,
        lang_id=lang,
        diff_id=diff
    )

    """スコアに対応するランクを決定し、ユーザーに設定"""
    if user:
        user.rank_id = determine_rank(score)
        user.save()

    """結果をリターン"""
    return Response({
        'new_score': new_score.score,
        'is_new_record': is_new_record,
        'rank': user.rank_id.rank_name if user.rank_id else 'No Rank'
    })

"""
スコアによってランクを決めるメソッド
TODO 後々変更
"""
def determine_rank(score):
    if score >= 1000:
        return Rank.objects.get(rank_name='社長')
    elif score >= 500:
        return Rank.objects.get(rank_name='課長')
    elif score >= 300:
        return Rank.objects.get(rank_name='係長')
    elif score >= 100:
        return Rank.objects.get(rank_name='主任')
    else:
        return Rank.objects.get(rank_name='メンバー')
