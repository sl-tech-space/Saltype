from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse

class APIOnlyJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        if renderer_context is None:
            return super().render(data, accepted_media_type, renderer_context)

        request = renderer_context.get('request')
        
        # ブラウザからの直接アクセスかどうかを確認
        is_browser_access = (
            # Accept ヘッダーに text/html が含まれる（ブラウザからのリクエスト）
            'text/html' in request.headers.get('Accept', '') and
            # かつ XMLHttpRequest ではない（JavaScriptからのリクエストではない）
            request.headers.get('X-Requested-With') != 'XMLHttpRequest'
        )

        if is_browser_access:
            return HttpResponse(status=404)

        return super().render(data, accepted_media_type, renderer_context) 