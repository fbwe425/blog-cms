// =============================================================================
// Cloudflare Pages Function — 登录处理
// 文件路径: functions/api/login.js
// =============================================================================

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { username, password } = await request.json();
    const authCreds = env.AUTH_CREDENTIALS;

    // 从 KV 读取存储的帐号密码
    const stored = await authCreds.get('admin', { type: 'json' });

    if (!stored) {
      return Response.json({ error: '系统未配置管理员帐号' }, { status: 500 });
    }

    // 验证帐号密码
    if (username !== stored.username || password !== stored.password) {
      return Response.json({ error: '帐号或密码错误' }, { status: 401 });
    }

    // 生成 session token
    const sessionToken = crypto.randomUUID();
    const sessions = env.SESSIONS;

    // 存储 session 到 KV（24小时过期）
    await sessions.put(sessionToken, JSON.stringify({
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000,
    }), { expirationTtl: 86400 });

    // 返回成功 + Set-Cookie
    return new Response(JSON.stringify({ success: true, redirect: '/admin/' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
      },
    });
  } catch (error) {
    return Response.json({ error: '请求格式错误' }, { status: 400 });
  }
}
