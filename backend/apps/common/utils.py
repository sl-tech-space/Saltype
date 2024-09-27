import logging

from django.db import DatabaseError
from rest_framework import status
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class HandleExceptions:

    def __call__(self, func):

        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except DatabaseError as e:
                logger.error(f"Database error: {e}")
                return Response({'error': 'Database error occurred.'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                return Response({'error': 'An unexpected error occurred.'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return wrapper
