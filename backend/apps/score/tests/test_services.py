from unittest.mock import patch

import pytest
from apps.common.models import Diff, Lang, Score
from apps.score.services import ScoreService
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def create_user():
    """テスト用のユーザーを作成するフィクスチャ"""
    user = User.objects.create_user(username="testuser", password="password")
    return user


@pytest.fixture
def create_lang():
    """Langモデルのインスタンスを作成するフィクスチャ"""
    lang = Lang.objects.create(lang="English")
    return lang


@pytest.fixture
def create_diff():
    """Diffモデルのインスタンスを作成するフィクスチャ"""
    diff = Diff.objects.create(diff="Easy")
    return diff


@pytest.mark.django_db
def testNo1_1_1():
    """平均スコア取得のテスト"""

    with patch("apps.common.models.Score.objects.filter") as mock_filter:
        """フィルタリングをモック化"""
        mock_filter.return_value.aggregate.return_value = {"score__avg": 850}
        score_service = ScoreService(user_id=1, lang_id=1, diff_id=1)
        average_score = score_service.get_average_score()

        assert average_score is not None
        assert average_score == 850


@pytest.mark.django_db
def testNo1_1_2():
    """スコアが存在しない場合のテスト"""

    score_service = ScoreService(user_id=1, lang_id=1, diff_id=1)
    average_score = score_service.get_average_score()

    assert average_score == 0


@pytest.mark.parametrize(
    "typing_count, accuracy, expected_score",
    [
        (10, 0.9, 90),  # 正常ケース
        (0, 0.9, 0),  # typing_countがゼロ
        (10, 0, 0),  # accuracyがゼロ
        (10, 0.75, 75),  # accuracyが小数
        (-10, 0.9, 0),  # typing_countが負
        (10, -0.9, 0),  # accuracyが負
    ],
)
@pytest.mark.django_db  # データベースアクセスを許可
def testNo1_2_1(
    create_user, create_lang, create_diff, typing_count, accuracy, expected_score
):
    """スコア計算のテスト"""
    score_service = ScoreService(user_id=1, lang_id=1, diff_id=1)

    calculated_score = score_service.calculate_score(typing_count, accuracy)

    assert calculated_score == expected_score


@pytest.fixture
def score_service(create_user):
    """スコアサービスインスタンスを作成するフィクスチャ"""
    return ScoreService(create_user.id, 1, 1)


@pytest.mark.django_db
def testNo1_3_1(score_service):
    """初回スコアの場合"""
    with patch("apps.common.models.Score.objects.filter") as mock_filter:
        mock_filter.return_value.order_by.return_value.first.return_value = None

        is_high_score, returned_score = score_service.is_new_high_score(500)

        assert is_high_score is True
        assert returned_score == 500


@pytest.mark.django_db
def testNo1_3_2(score_service):
    """新しいスコアが既存の最高スコアを超える場合"""
    with patch("apps.common.models.Score.objects.filter") as mock_filter:
        # 既存のスコアが400
        mock_filter.return_value.order_by.return_value.first.return_value = Score(
            score=400
        )

        is_high_score, returned_score = score_service.is_new_high_score(500)

        assert is_high_score is True
        assert returned_score == 500


@pytest.mark.django_db
def testNo1_3_3(score_service):
    """新しいスコアが既存の最高スコアと等しい場合"""
    with patch("apps.common.models.Score.objects.filter") as mock_filter:
        # 既存のスコアが500
        mock_filter.return_value.order_by.return_value.first.return_value = Score(
            score=500
        )

        is_high_score, returned_score = score_service.is_new_high_score(500)

        assert is_high_score is False
        assert returned_score == 500


@pytest.mark.django_db
def testNo1_3_4(score_service):
    """新しいスコアが既存の最高スコアより低い場合"""
    with patch("apps.common.models.Score.objects.filter") as mock_filter:
        # 既存のスコアが600
        mock_filter.return_value.order_by.return_value.first.return_value = Score(
            score=600
        )

        is_high_score, returned_score = score_service.is_new_high_score(500)

        assert is_high_score is False
        assert returned_score == 600


@pytest.mark.parametrize(
    "score, expected_rank",
    [
        (1000, "社長"),  # スコアが1000
        (950, "取締役"),  # スコアが900以上
        (800, "部長"),  # スコアが700以上
        (600, "課長"),  # スコアが500以上
        (400, "係長"),  # スコアが300以上
        (200, "主任"),  # スコアが100以上
        (50, "メンバー"),  # スコアが0以上
    ],
)
def testNo1_4_1(score, expected_rank):
    """determine_rankのテスト"""
    score_service = ScoreService(user_id=1, lang_id=1, diff_id=1)
    rank = score_service.determine_rank(score)

    assert rank == expected_rank


@pytest.fixture
def create_scores_for_ranking(create_user, create_lang, create_diff):
    """ランキングテスト用のスコアを作成するフィクスチャ"""
    # 異なるスコアを挿入
    Score.objects.create(
        user=create_user, score=900, lang=create_lang, diff=create_diff
    )
    Score.objects.create(
        user=create_user, score=850, lang=create_lang, diff=create_diff
    )
    Score.objects.create(
        user=create_user, score=950, lang=create_lang, diff=create_diff
    )
    Score.objects.create(
        user=create_user, score=750, lang=create_lang, diff=create_diff
    )


@pytest.mark.django_db
@pytest.mark.parametrize(
    "score, expected_ranking",
    [
        (950, 1),  # 最も高いスコアで順位1
        (900, 2),  # 950より低いスコアで順位2
        (850, 3),  # 900より低いスコアで順位3
        (750, 4),  # 最も低いスコアで順位4
    ],
)
def testNo1_5_1(
    create_user,
    create_lang,
    create_diff,
    create_scores_for_ranking,
    score,
    expected_ranking,
):
    """get_ranking_positionのテスト"""
    score_service = ScoreService(
        create_user.id, create_lang.lang_id, create_diff.diff_id
    )
    rank = score_service.get_ranking_position(score)

    assert rank == expected_ranking
