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

    const response = await $fetch<{ data: { permission: number } }>(`${config.public.baseURL}/api/django/user/${user_id}/`, {
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (typeof response.data?.permission !== 'number') {
      console.error('Unexpected response structure:', response)
      throw createError({
        statusCode: 500,
        statusMessage: 'ユーザー情報の構造が不正です。'
      })
    }

    const isAdmin = response.data.permission === 0

    return { isAdmin }
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: '管理者権限チェック中にエラーが発生しました。'
    })
  }
})
