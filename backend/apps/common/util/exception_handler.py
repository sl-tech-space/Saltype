import logging

from django.db import DatabaseError, IntegrityError
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class HandleExceptions:
    """エラーハンドリングのためのデコレータ"""

    def __call__(self, func):

        def wrapper(request, *args, **kwargs):
            try:
                return func(request, *args, **kwargs)
            except (ValidationError, ValueError) as e:
                return self.handle_validation_error(e)
            except IntegrityError:
                return self.handle_integrity_error()
            except DatabaseError:
                return self.handle_database_error()
            except Http404:
                return self.handle_http404_error()
            except Exception:
                logger.exception("Unexpected error occurred")
                return Response(
                    {"error": "内部エラーが発生しました。"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return wrapper

    def handle_validation_error(self, e):
        logger.error(f"Validation error occurred: {e}")
        return Response(
            {"error": "入力値にエラーがあります。", "details": e.detail},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def handle_integrity_error(self):
        logger.error("IntegrityError occurred")
        return Response(
            {"error": "データ整合性のエラーが発生しました。"},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    def handle_database_error(self):
        logger.error("Database error occurred")
        return Response(
            {"error": "データベースエラーが発生しました。"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    def handle_http404_error(self):
        logger.warning("Http404 occurred")
        return Response(
            {"error": "対象のリソースが見つかりませんでした。"},
            status=status.HTTP_404_NOT_FOUND,
        )
