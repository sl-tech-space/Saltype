from rest_framework.exceptions import ValidationError

class CommonUtils:
    @staticmethod
    def validate_request_params(data, required_params):
        """
        リクエストのパラメータをバリデーションする共通メソッド
        """
        missing_params = [param for param in required_params if not data.get(param)]
        
        if missing_params:
            raise ValidationError(f"{', '.join(missing_params)} が必要です。")

        return [data[param] for param in required_params]