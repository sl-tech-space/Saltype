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
                return self.handle_validation_error(e)
            except IntegrityError as e:
                return self.handle_integrity_error(e)
            except DatabaseError as e:
                return self.handle_database_error(e)
            except Http404 as e:
                return self.handle_http404_error(e)
            except Exception as e:
                logger.exception("予期しないエラーが発生しました")
                return Response(
                    {
                        "error": "内部エラーが発生しました。詳細についてはログを確認してください。"
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return wrapper

    def handle_validation_error(self, e):
        """入力値のバリデーションエラーを処理"""
        logger.error(f"バリデーションエラー: {e}")
        if hasattr(e, "detail"):
            logger.error(
                f"エラーディテール: {e.detail}"
            )  # バリデーションエラーの詳細をログに出力
        return Response(
            {"error": "入力値にエラーがあります。", "details": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def handle_integrity_error(self, e):
        """データ整合性エラーを処理"""
        logger.error(f"データ整合性エラー: {str(e)}")
        return Response(
            {
                "error": "データの整合性に問題があります。重複したデータや制約違反が発生しました。"
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    def handle_database_error(self, e):
        """データベース関連のエラーを処理"""
        logger.error(f"データベースエラー: {str(e)}")
        return Response(
            {"error": "データベースエラーが発生しました。再度お試しください。"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    def handle_http404_error(self, e):
        """リソースが見つからないエラーを処理"""
        logger.warning(f"リソースが見つかりませんでした: {str(e)}")
        return Response(
            {"error": "対象のリソースが見つかりませんでした。"},
            status=status.HTTP_404_NOT_FOUND,
        )
