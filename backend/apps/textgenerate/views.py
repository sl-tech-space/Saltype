import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view


class GenerateTextView(BaseScoreView):
    def generate_text(request):
        # ユーザーからの入力を取得
        user_input = request.data.get("input")

        if not user_input:
            return Response({"error": "入力テキストが必要です"}, status=400)

        try:
            # Ollama APIにリクエストを送る（ローカルAPIの場合）
            response = requests.post(
                "http://localhost:11434/api/generate",  # ローカルOllama APIエンドポイント
                json={"model": "deepseek-r1:7b", "prompt": user_input},
                headers={
                    "Authorization": "Bearer YOUR_OLLAMA_API_KEY"
                },  # APIキーが必要な場合
            )

            if response.status_code == 200:
                # レスポンスから生成されたテキストを取得
                generated_text = response.json().get("text", "")
                return Response({"generatedText": generated_text})
            else:
                return Response(
                    {"error": "Ollamaからテキストを生成できませんでした"},
                    status=response.status_code,
                )

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"リクエスト中にエラーが発生しました: {str(e)}"}, status=500
            )
