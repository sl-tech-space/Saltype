from rest_framework.exceptions import ValidationError
import logging
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.db import DatabaseError

logger = logging.getLogger(__name__)

class CommonUtils:
    @staticmethod
    def validate_request_params(data, required_params):
        """
        リクエストのパラメータをバリデーションする共通メソッド
        """
        missing_params = [param for param in required_params if not data.get(param)]
        
        if missing_params:
            error_message = f"{', '.join(missing_params)} が必要です。"
            logger.error(error_message)  # ロギングを追加
            raise ValidationError(error_message)

        return [data[param] for param in required_params]

class HandleExceptions:
    def __call__(self, func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except DatabaseError as e:
                logger.error(f"Database error: {e}")
                return Response({'error': 'Database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return wrapper
