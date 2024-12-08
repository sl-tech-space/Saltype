from typing import Any, Dict
from apps.common.models import Miss
from django.db import transaction
from .base_view import BaseMistypeView


class MistypeView(BaseMistypeView):
    """
    ミスタイプの挿入、更新、またはトップミスタイプを取得するクラス。
    """

    def handle_request(self, validated_data: Dict[str, Any]):
        action = validated_data.get("action")
        user_id = validated_data.get("user_id")  # ユーザーIDを取得

        if action == "insert_mistypes":
            # mistypesが存在しない場合は空のリストを渡す
            mistypes = validated_data.get("mistypes", [])
            result = [self.update_or_create_mistype(data, user_id) for data in mistypes]
            return self.format_response(
                {"mistypes": result},
                status="success" if result else "failure",
            )
        elif action == "get_top_mistypes":
            top_mistypes = Miss.objects.filter(user_id=user_id).order_by("-miss_count")[
                : validated_data.get("limit")
            ]
            result = [
                {"miss_char": miss.miss_char, "miss_count": miss.miss_count}
                for miss in top_mistypes
            ]
            return self.format_response(
                {"top_mistypes": result},
                status="success" if result else "failure",
            )

    @transaction.atomic
    def update_or_create_mistype(self, data: Dict[str, Any], user_id: int):
        miss_char, miss_count = data["miss_char"], data["miss_count"]

        # miss_char と user_id の組み合わせで既存レコードを検索
        miss_instance = Miss.objects.filter(
            miss_char=miss_char, user_id=user_id
        ).first()

        # miss_instance が存在しない場合は新たに作成
        if not miss_instance:
            miss_instance = Miss.objects.create(
                user_id=user_id, miss_char=miss_char, miss_count=miss_count
            )
        else:
            # miss_instance が存在する場合、そのカウントを加算
            miss_instance.miss_count += miss_count
            miss_instance.save()

        return {
            "miss_char": miss_instance.miss_char,
            "miss_count": miss_instance.miss_count,
        }
