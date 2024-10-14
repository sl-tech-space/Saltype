import logging

from django.db import DatabaseError, IntegrityError
from rest_framework import status
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class HandleExceptions:
    """エラーハンドリング"""

    def __call__(self, func):

        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except ValueError as e:
                logger.error(f"ValueError occurred: {e}")
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except IntegrityError as e:
                logger.error(f"IntegrityError occurred: {e}")
                return Response({'error': 'データ整合性のエラーが発生しました。'},
                                status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            except DatabaseError as e:
                logger.error(f"Database error: {e}")
                return Response({'error': 'データベースエラーが発生しました。'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.exception("Unexpected error occurred")
                return Response({'error': '予期せぬエラーが発生しました。'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return wrapper
