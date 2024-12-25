import { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)
    const { user_id } = body

    if (!user_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ユーザーIDが提供されていません。'
      })
    }

    const userInfo = await $fetch<{ permission: number }>(`${config.public.baseURL}/user/${user_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (typeof userInfo.permission !== 'number') {
      throw createError({
        statusCode: 500,
        statusMessage: 'ユーザー情報の取得に失敗しました。'
      })
    }

    const isAdmin = userInfo.permission === 0

    return { isAdmin }
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: '管理者権限チェック中にエラーが発生しました。'
    })
  }
})
