from unittest.mock import patch

import pytest
from apps.mistype.models import Miss
from apps.mistype.services import MistypeService
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def create_user():
    """テスト用のユーザーを作成するフィクスチャ"""
    user = User.objects.create_user(username="testuser", password="password")
    return user


@pytest.mark.django_db
def testNo2_1_1(create_user):
    """新しいミスタイプがインサートされることを確認するテスト"""
    mistype_service = MistypeService()
    miss_data = [
        {"miss_char": "a", "miss_count": 5},
        {"miss_char": "b", "miss_count": 3},
    ]

    # ミスタイプを挿入
    inserted_data = mistype_service.insert_mistypes(create_user.id, miss_data)

    # データベースに正しく挿入されているか確認
    assert len(inserted_data) == 2
    assert Miss.objects.filter(
        user_id=create_user.id, miss_char="a", miss_count=5
    ).exists()
    assert Miss.objects.filter(
        user_id=create_user.id, miss_char="b", miss_count=3
    ).exists()


@pytest.mark.django_db
def testNo2_1_2(create_user):
    """既存のミスタイプが更新されることを確認するテスト"""
    mistype_service = MistypeService()

    # 既存のミスタイプデータを作成
    Miss.objects.create(user_id=create_user.id, miss_char="a", miss_count=5)

    miss_data = [{"miss_char": "a", "miss_count": 2}]

    # ミスタイプを更新
    inserted_data = mistype_service.insert_mistypes(create_user.id, miss_data)

    # データベースが正しく更新されたか確認
    assert len(inserted_data) == 1
    miss_instance = Miss.objects.get(user_id=create_user.id, miss_char="a")
    assert miss_instance.miss_count == 7  # 元の5に2が加算される


@pytest.mark.django_db
def testNo2_2_1(create_user):
    """トップミスタイプの取得テスト"""
    mistype_service = MistypeService()

    # テスト用にいくつかのミスタイプを作成
    Miss.objects.create(user_id=create_user.id, miss_char="a", miss_count=10)
    Miss.objects.create(user_id=create_user.id, miss_char="b", miss_count=5)
    Miss.objects.create(user_id=create_user.id, miss_char="c", miss_count=3)

    # トップ2のミスタイプを取得
    top_miss_types = mistype_service.get_topmisstypes(create_user.id, 2)

    # 正しい順序でデータが取得されているか確認
    assert len(top_miss_types) == 2
    assert top_miss_types[0].miss_char == "a"
    assert top_miss_types[0].miss_count == 10
    assert top_miss_types[1].miss_char == "b"
    assert top_miss_types[1].miss_count == 5
