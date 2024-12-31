import pytest
from apps.common.models import Score


@pytest.mark.django_db
def test_insert_score(api_client, create_user, create_lang, create_diff):
    """スコアの挿入リクエストのテスト"""
    data = {
        "user_id": create_user.id,
        "lang_id": create_lang.id,
        "diff_id": create_diff.id,
        "typing_count": 100,
        "accuracy": 0.95,
    }
    response = api_client.post("/api/score/insert/", data, format="json")
    assert response.status_code == 201
    assert response.data["status"] == "success"
    assert response.data["score"] == 950  # 100 * 10 * 0.95

@pytest.mark.django_db
def test_get_average_score(api_client, create_user, create_lang, create_diff):
    """平均スコア取得のテスト"""
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=850
    )
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=950
    )

    response = api_client.get(
        f"/api/score/average/?user_id={create_user.id}&lang_id={create_lang.id}&diff_id={create_diff.id}"
    )
    assert response.status_code == 200
    assert response.data["average_score"] == 900

@pytest.mark.django_db
def test_get_past_scores(api_client, create_user, create_lang, create_diff):
    """過去のスコア取得のテスト"""
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=850
    )
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=950
    )

    response = api_client.get(
        f"/api/score/past/?user_id={create_user.id}&lang_id={create_lang.id}&diff_id={create_diff.id}"
    )
    assert response.status_code == 200
    assert response.data["scores"] == [950, 850]

@pytest.mark.django_db
def test_get_ranking_position(api_client, create_user, create_lang, create_diff):
    """ランキング位置取得のテスト"""
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=900
    )
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=850
    )
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=950
    )
    Score.objects.create(
        user=create_user, lang=create_lang, diff=create_diff, score=750
    )

    response = api_client.get(
        f"/api/score/ranking/?user_id={create_user.id}&lang_id={create_lang.id}&diff_id={create_diff.id}&score=950"
    )
    assert response.status_code == 200
    assert response.data["ranking_position"] == 1

    response = api_client.get(
        f"/api/score/ranking/?user_id={create_user.id}&lang_id={create_lang.id}&diff_id={create_diff.id}&score=900"
    )
    assert response.status_code == 200
    assert response.data["ranking_position"] == 2

    response = api_client.get(
        f"/api/score/ranking/?user_id={create_user.id}&lang_id={create_lang.id}&diff_id={create_diff.id}&score=850"
    )
    assert response.status_code == 200
    assert response.data["ranking_position"] == 3

    response = api_client.get(
        f"/api/score/ranking/?user_id={create_user.id}&lang_id={create_lang.id}&diff_id={create_diff.id}&score=750"
    )
    assert response.status_code == 200
    assert response.data["ranking_position"] == 4

@pytest.mark.django_db
def test_update_user_rank(api_client, create_user, create_lang, create_diff):
    """ユーザーランク更新のテスト"""
    data = {
        "user_id": create_user.id,
        "lang_id": create_lang.id,
        "diff_id": create_diff.id,
        "score": 950,
    }
    response = api_client.post("/api/score/update_rank/", data, format="json")
    assert response.status_code == 200
    assert response.data["status"] == "success"
    assert response.data["rank_name"] == "取締役"
