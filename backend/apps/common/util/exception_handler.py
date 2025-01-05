import logging
from django.db import DatabaseError, IntegrityError
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

# ロガーを設定
logger = logging.getLogger(__name__)


class HandleExceptions:
    """エラーハンドリングのためのデコレータ"""

    def __call__(self, func):
        def wrapper(request, *args, **kwargs):
            try:
                return func(request, *args, **kwargs)
            except (ValidationError, ValueError) as e:
                return self._handle_error(
                    e, "バリデーションエラー", status.HTTP_400_BAD_REQUEST
                )
            except IntegrityError as e:
                return self._handle_error(
                    e, "データ整合性エラー", status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            except DatabaseError as e:
                return self._handle_error(
                    e, "データベースエラー", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Http404 as e:
                return self._handle_error(
                    e, "リソースが見つかりませんでした", status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                logger.exception("予期しないエラーが発生しました")
                return Response(
                    {
                        "error": "内部エラーが発生しました。詳細についてはログを確認してください。"
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return wrapper

    def _handle_error(self, e, log_message, response_status):
        if isinstance(e, (ValidationError, ValueError)) and hasattr(e, "detail"):
            logger.error(f"{log_message}: {e.detail}")
            details = e.detail
        else:
            logger.error(f"{log_message}: {str(e)}")
            details = str(e)

        return Response(
            {"error": log_message, "details": details},
            status=response_status,
        )
