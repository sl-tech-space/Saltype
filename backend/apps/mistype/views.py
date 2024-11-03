from typing import Any, Dict, List

from apps.common.util.exception_handler import HandleExceptions
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Miss
from .serializers import MistypeSerializer


class MistypeAPIView(APIView):
    """ミスタイプに関連する操作のためのスーパークラス"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """POSTメソッドでスコア関連のリクエストを処理"""
        serializer = MistypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = self.handle_request(serializer.validated_data)
        return Response(response_data, status=status.HTTP_200_OK)

    def handle_request(self, validated_data):
        """リクエストデータを処理するロジック"""
        raise NotImplementedError("サブクラスはhandle_requestメソッドを実装する必要があります")


class InsertMistypeDataView(MistypeAPIView):
    """ミスタイプの挿入または更新を行うクラス"""

    def handle_request(self, validated_data: Dict[str, Any]) -> Dict[str, Any]:
        """ミスタイプの挿入または更新"""
        user_id = validated_data.get('user_id')
        mistypes_data = validated_data.get('mistypes')
        inserted_data = self.insert_mistypes(user_id, mistypes_data)
        return self.format_response(inserted_data)

    @transaction.atomic
    def insert_mistypes(self, user_id: int, mistypes_data: List[Dict[str,
                                                                     Any]]) -> List[Dict[str, Any]]:
        """ミスタイプのデータベースへの挿入または更新"""
        return [self.update_or_create_mistype(data) for data in mistypes_data]

    def update_or_create_mistype(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """個々のミスタイプの挿入または更新"""
        miss_char = data.get('miss_char')
        miss_count = data.get('miss_count')
        miss_instance, created = Miss.objects.get_or_create(miss_char=miss_char,
                                                            defaults={'miss_count': miss_count})
        miss_instance.miss_count += miss_count
        miss_instance.save()

        return {'miss_char': miss_instance.miss_char,\
                'miss_count': miss_instance.miss_count
        }

    def format_response(self, inserted_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """挿入または更新されたミスタイプデータのフォーマット"""
        return {'status': 'success',\
                'inserted_mistypes': inserted_data
        }


class TopMistypesView(MistypeAPIView):
    """トップミスタイプを取得するクラス"""

    def handle_request(self, validated_data: Dict[str, Any]) -> Dict[str, Any]:
        """検証されたデータを使用したトップミスタイプの取得"""
        user_id = validated_data['user_id']
        limit = validated_data['limit']
        top_mistypes = self.get_top_mistypes(user_id, limit)
        return self.format_response(top_mistypes)

    def get_top_mistypes(self, user_id: int, limit: int) -> List[Dict[str, Any]]:
        """ユーザーのトップミスタイプの取得"""
        return [{
            "miss_char": miss.miss_char,
            "miss_count": miss.miss_count
        } for miss in Miss.objects.filter(user_id=user_id).order_by('-miss_count')[:limit]]

    def format_response(self, top_mistypes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """トップミスタイプデータのフォーマット"""
        if not top_mistypes:
            return {'status': 'not_found',\
                    'top_mistypes': []
            }
        return {'status': 'success',\
                'top_mistypes': top_mistypes
        }
