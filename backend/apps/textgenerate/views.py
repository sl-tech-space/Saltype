import google.generativeai as genai
from apps.textgenerate.base_view import BaseGenerateTextView
from apps.textgenerate.prompts import generate_prompt

# API キーを設定
genai.configure(api_key="AIzaSyAJNt4NE2pLnRAdvkMVWoQ_yHs8YFpUbWI")


class GenerateTextView(BaseGenerateTextView):
    def handle_post_request(self, validated_data):
        # ユーザーの入力を取得
        user_input = validated_data.get("input")

        # モデルの指定
        model = genai.GenerativeModel("gemini-1.5-flash") 

        # AI にリクエストを送る
        try:
            # 任意の単語に関連する簡単な文書を生成
            prompt = generate_prompt(user_input)
            response = model.generate_content(prompt)
            return {"generatedText": response.text}
        except Exception as e:
            return {"error": f"リクエストエラー: {str(e)}"}
