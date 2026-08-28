// =============================================================================
// Cloudflare Pages Function — 验证 Session
// 文件路径: functions/api/auth.js
// =============================================================================

export async function onRequest(context) {
  const { request, env } = context;

  // 从 Cookie 中提取 session
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  const sessionToken = match ? match[1] : null;

  if (!sessionToken) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  // 验证 session 是否有效
  const sessions = env.SESSIONS;
  const sessionData = await sessions.get(sessionToken, { type: 'json' });

  if (!sessionData) {
    return Response.json({ authenticated: false, error: '登录已过期' }, { status: 401 });
  }

  // 检查是否过期
  if (Date.now() > sessionData.expiresAt) {
    await sessions.delete(sessionToken);
    return Response.json({ authenticated: false, error: '登录已过期' }, { status: 401 });
  }

  return Response.json({
    authenticated: true,
    username: sessionData.username,
  });
}
