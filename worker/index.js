// =============================================================================
// Cloudflare Worker — Decap CMS 认证代理（ES Module 格式）
// =============================================================================

export default {
  async fetch(request, event) {
    const url = new URL(request.url);

    // 登录页面
    if (url.pathname === '/admin/login' && request.method === 'GET') {
      return new Response(getLoginPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // 处理登录
    if (url.pathname === '/admin/login' && request.method === 'POST') {
      return handleLogin(request, event);
    }

    // 登出
    if (url.pathname === '/admin/logout') {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/admin/login',
          'Set-Cookie': 'session=; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
        },
      });
    }

    // 验证 session 后代理 GitHub API 请求
    if (url.pathname.startsWith('/admin/api/')) {
      const session = getSession(request);
      if (!session) {
        return new Response(JSON.stringify({ error: '未登录' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 验证 session 是否有效
      const sessions = event.env.SESSIONS;
      const valid = await sessions.get(session);
      if (!valid) {
        return new Response(JSON.stringify({ error: '登录已过期，请重新登录' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 代理请求到 GitHub API
      return proxyToGitHub(request, event);
    }

    // 其他请求放行
    return fetch(request);
  },
};

// =============================================================================
// 登录页面 HTML
// =============================================================================
function getLoginPage() {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>登录 - 后台管理</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-box {
      width: 100%;
      max-width: 380px;
      padding: 2.5rem;
      background: #1a1a1a;
      border-radius: 12px;
      border: 1px solid #333;
    }
    .login-box h1 { text-align: center; margin-bottom: 0.5rem; font-size: 1.5rem; }
    .login-box .subtitle { text-align: center; color: #666; margin-bottom: 2rem; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; margin-bottom: 0.4rem; font-size: 0.9rem; color: #999; }
    input[type="text"], input[type="password"] {
      width: 100%; padding: 10px 14px; font-size: 1rem; border: 1px solid #333;
      border-radius: 8px; background: #0a0a0a; color: #fff; outline: none;
    }
    input:focus { border-color: #2563eb; }
    .btn {
      width: 100%; padding: 12px; margin-top: 0.5rem; font-size: 1rem; border: none;
      border-radius: 8px; background: #2563eb; color: #fff; cursor: pointer;
    }
    .btn:hover { background: #1d4ed8; }
    .error { color: #ef4444; font-size: 0.85rem; margin-top: 0.8rem; text-align: center; display: none; }
    .error.show { display: block; }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>🔐 后台管理</h1>
    <p class="subtitle">请输入帐号和密码登录</p>
    <form id="loginForm">
      <div class="form-group">
        <label for="username">帐号</label>
        <input type="text" id="username" name="username" required autofocus>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button type="submit" class="btn" id="submitBtn">登 录</button>
      <div class="error" id="errorMsg"></div>
    </form>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const err = document.getElementById('errorMsg');
      btn.disabled = true;
      btn.textContent = '登录中...';
      err.classList.remove('show');
      const resp = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value,
          password: document.getElementById('password').value,
        }),
      });
      if (resp.redirected) {
        window.location.href = resp.url.replace('/admin/login', '/admin/');
        return;
      }
      const data = await resp.json();
      if (data.error) {
        err.textContent = data.error;
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = '登 录';
      }
    });
  </script>
</body>
</html>`;
}

// =============================================================================
// 处理登录
// =============================================================================
async function handleLogin(request, event) {
  const { username, password } = await request.json();
  const authCreds = event.env.AUTH_CREDENTIALS;
  const stored = await authCreds.get('admin', { type: 'json' });

  if (!stored) {
    return Response.json({ error: '系统未配置管理员帐号' }, { status: 500 });
  }

  if (username !== stored.username || password !== stored.password) {
    return Response.json({ error: '帐号或密码错误' }, { status: 401 });
  }

  const sessionToken = crypto.randomUUID();
  const sessions = event.env.SESSIONS;

  await sessions.put(sessionToken, JSON.stringify({
    username,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000,
  }), { expirationTtl: 86400 });

  return new Response(JSON.stringify({ success: true }), {
    status: 302,
    headers: {
      'Location': '/admin/',
      'Set-Cookie': 'session=' + sessionToken + '; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=86400',
    },
  });
}

// =============================================================================
// 从 Cookie 中提取 session
// =============================================================================
function getSession(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  return match ? match[1] : null;
}

// =============================================================================
// 代理请求到 GitHub API
// =============================================================================
async function proxyToGitHub(request, event) {
  const url = new URL(request.url);
  const githubApiBase = 'https://api.github.com';
  const githubPath = url.pathname.replace('/admin/api', '');

  const headers = new Headers(request.headers);
  headers.set('Accept', 'application/vnd.github.v3+json');
  headers.delete('Host');
  headers.delete('Cookie');

  const newRequest = new Request(githubApiBase + githubPath + url.search, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  });

  return fetch(newRequest);
}
