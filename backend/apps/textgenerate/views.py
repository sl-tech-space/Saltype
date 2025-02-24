import google.generativeai as genai
from apps.textgenerate.base_view import BaseGenerateTextView
from apps.textgenerate.prompts import generate_prompt
from config.settings import API_KEY

# API キーを設定
genai.configure(api_key=API_KEY)


class GenerateTextView(BaseGenerateTextView):
    """
    テキスト生成API
    """

    def handle_post_request(self, validated_data):
        """
        テキスト生成APIのハンドラー
        """
        # ユーザーの入力を取得
        user_input = validated_data.get("input")

        # モデルの指定
        model = genai.GenerativeModel("gemini-1.5-flash")

        # 任意の単語に関連する簡単な文書を生成
        prompt = generate_prompt(user_input)

        # AI にリクエストを送る
        try:
            response = model.generate_content(prompt)
            generated_text = response.text

            # 生成されたテキストを整形
            parts = generated_text.split("。")
            kanji_hiragana_pairs = []

            for i in range(0, len(parts) - 1, 2):
                kanji_text = parts[i].strip()
                hiragana_text = parts[i + 1].strip()
                kanji_hiragana_pairs.append([kanji_text, hiragana_text])

            return {"generatedPairs": kanji_hiragana_pairs}
        except Exception as e:
            return {"error": f"リクエストエラー: {str(e)}"}
