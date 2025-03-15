import google.generativeai as genai
import random
from apps.textgenerate.prompts import generate_prompt
from apps.textgenerate.serializers import GenerateTextViewSerializer
from apps.common.views import BaseView
from config.settings import API_KEY,AI_MODEL

# API キーを設定
genai.configure(api_key=API_KEY)


class GenerateTextView(BaseView):
    """
    テキスト生成API
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, GenerateTextViewSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data):
        """
        テキスト生成APIのハンドラー
        """
        # ユーザーの入力を取得
        user_input = validated_data.get("input")
        # リクエストからユーザーIDを取得
        user_id = validated_data.get("user_id")

        # 毎回新しい結果を生成するためのランダム要素を追加
        random_seed = random.randint(1, 10000)
        
        # モデルの指定
        model = genai.GenerativeModel(AI_MODEL)

        # プロンプトを生成（ユーザーIDとランダム要素を含める）
        prompt = generate_prompt(user_input) + f" ユーザーID: {user_id}, ランダムシード: {random_seed}"

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

            # ユーザー固有の結果を返す（DBへの保存なし）
            return {"userId": user_id, "generatedPairs": kanji_hiragana_pairs}
        except Exception as e:
            return {"error": f"リクエストエラー: {str(e)}"}
