export function useSentence(language: string, difficultyLevel: string) {
    const sentence = async () => {
        try {
            const response = await fetch("/api/random-sentences", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: language,
                    difficultyLevel: difficultyLevel,
                }),
            });

            if (!response.ok) {
                throw new Error(`サーバーエラー: ${response.status}`);
            }

            const data = await response.json();

            //TODO test
            console.log(data)

            return data;
        } catch (error) {
            console.error("ネットワークエラーまたはその他例外が発生しました:", error);
            return null;
        }
    };

    return {
        sentence,
    };
}
