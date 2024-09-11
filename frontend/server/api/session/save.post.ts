import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { user_id, email, username } = body;

  event.context.session.user = {
    user_id: user_id,
    email: email,
    username: username,
  };

  return { success: true, message: "セッションにユーザ情報を保存しました" }
});
