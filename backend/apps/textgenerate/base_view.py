from apps.common.views import BaseView
from apps.textgenerate.serializers import TextGenerateSerializer


class BaseGenerateTextView(BaseView):
    """
    テキスト生成関連の操作をするための基底クラス。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, TextGenerateSerializer, *args, **kwargs)
