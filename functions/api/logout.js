// =============================================================================
// Cloudflare Pages Function — 登出
// 文件路径: functions/api/logout.js
// =============================================================================

export async function onRequestPost(context) {
  const { request, env } = context;

  // 从 Cookie 中提取 session
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  const sessionToken = match ? match[1] : null;

  // 删除 session
  if (sessionToken) {
    const sessions = env.SESSIONS;
    await sessions.delete(sessionToken);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
