import { H3Event } from "h3";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();

  try {
    const body = await readBody(event);
    const { user_id } = body;

    if (!user_id) {
      throw createError({
        statusCode: 400,
        message: "ユーザーIDが提供されていません。",
      });
    }

    const response = await $fetch<{ data: { permission: number } }>(
      `${config.public.serverSideBaseURL}/api/django/user/${user_id}/`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (typeof response.data?.permission !== "number") {
      throw createError({
        statusCode: 500,
        message: "ユーザー情報の構造が不正です。",
      });
    }

    const isAdmin = response.data.permission === 0;

    return { isAdmin };
  } catch {
    throw createError({
      statusCode: 500,
      message: "管理者権限チェック中にエラーが発生しました。",
    });
  }
});
