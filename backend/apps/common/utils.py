from rest_framework.exceptions import ValidationError

class CommonUtils:
    @staticmethod
    def validate_request_params(data):
        """
        リクエストのパラメータをバリデーションする共通メソッド
        """
        user_id = data.get('user_id')
        lang_id = data.get('lang_id')
        diff_id = data.get('diff_id')

        if not all([user_id, lang_id, diff_id]):
            raise ValidationError("user_id, lang_id, and diff_id are required.")

        return user_id, lang_id, diff_id
