import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  try {
    const body = await readBody(event);
    const { user_id } = body;

    if (!user_id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ユーザーIDが提供されていません。",
      });
    }

    const userInfo = await $fetch(`${config.public.baseURL}/user/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!userInfo || typeof userInfo.permission !== "number") {
      throw new Error("ユーザー情報の取得に失敗しました。");
    }

    const isAdmin = userInfo.permission === 0;

    return { isAdmin };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "管理者権限チェック中にエラーが発生しました。",
    });
  }
});
