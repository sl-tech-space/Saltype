from django.db import migrations


def add_initial_data(apps, schema_editor):
    """モデル取得"""
    Lang = apps.get_model("common", "Lang")
    Diff = apps.get_model("common", "Diff")
    Rank = apps.get_model("common", "Rank")

    """言語インサート"""
    Lang.objects.bulk_create(
        [
            Lang(lang="日本語"),
            Lang(lang="英語"),
        ]
    )

    """難易度インサート"""
    Diff.objects.bulk_create(
        [
            Diff(diff="イージー"),
            Diff(diff="ノーマル"),
            Diff(diff="ハード"),
        ]
    )

    """ランクインサート"""
    Rank.objects.bulk_create(
        [
            Rank(rank="メンバー"),
            Rank(rank="主任"),
            Rank(rank="係長"),
            Rank(rank="課長"),
            Rank(rank="部長"),
            Rank(rank="取締役"),
            Rank(rank="社長"),
        ]
    )


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(add_initial_data),
    ]
