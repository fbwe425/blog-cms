# 🔐 Git Gateway 帐号密码认证配置指南

本指南帮助你将 Decap CMS 的认证方式从 GitHub OAuth 改为**帐号密码登录**。

## 📋 前置条件

1. **Netlify 账户**（免费）— https://app.netlify.com/signup
2. **GitHub 仓库** — 已推送到 `fbwe425/blog-cms`

## 🚀 配置步骤

### 第一步：连接 Netlify

1. 登录 [Netlify](https://app.netlify.com)
2. 点击 **"Add new site"** → **"Import an existing project"**
3. 选择 **GitHub**
4. 授权 Netlify 访问你的 GitHub 仓库
5. 选择 **`blog-cms`** 仓库

### 第二步：配置构建设置

在 Netlify 站点设置中：

| 设置项 | 值 |
|--------|-----|
| **Branch to deploy** | `main` |
| **Build command** | `hugo --minify` |
| **Publish directory** | `public` |
| **Hugo version** | `0.139.0`（在 Environment variables 中设置） |

### 第三步：设置环境变量

进入 **Site settings** → **Build & deploy** → **Environment variables**

添加：
```
HUGO_VERSION = 0.139.0
HUGO_ENVIRONMENT = production
```

### 第四步：启用 Netlify Identity

1. 进入 **Site settings** → **Identity**
2. 点击 **"Enable Netlify Identity"**
3. 在 **Registration preferences** 中选择：
   - **Open** — 允许任何人注册（适合个人博客）
   - **Invite only** — 仅邀请用户（更安全）

### 第五步：启用 Git Gateway

1. 在 **Identity** 页面，向下滚动到 **Services**
2. 点击 **"Enable Git Gateway"**
3. 选择 **GitHub** 作为 Git provider
4. 授权 Netlify 访问你的仓库

### 第六步：邀请用户

**方式一：通过 Netlify 邀请（推荐）**

1. 进入 **Identity** 页面
2. 点击 **"Invite users"**
3. 输入用户邮箱
4. 用户会收到邮件，点击链接注册帐号

**方式二：自己先注册**

1. 访问你的站点 `https://你的站点名.netlify.app/admin/`
2. 点击 **"Login with Netlify Identity"**
3. 输入邮箱，设置密码
4. 完成注册

### 第七步：更新配置

编辑 `static/admin/config.yml`，将 `identity_url` 和 `gateway_url` 改为你的实际 Netlify 站点地址：

```yaml
backend:
  name: git-gateway
  branch: main
  identity_url: https://你的站点名.netlify.app/.netlify/identity
  gateway_url: https://你的站点名.netlify.app/.netlify/git
```

### 第八步：推送到 GitHub

```bash
cd blog-cms
git add .
git commit -m "feat: 切换到 Git Gateway 帐号密码认证"
git push
```

## ✅ 验证

1. 访问 `https://你的站点名.netlify.app/admin/`
2. 应该看到 Netlify Identity 登录界面
3. 输入注册的邮箱和密码
4. 成功进入后台管理面板

## 🔧 常见问题

### Q: 忘记密码怎么办？

在 Netlify Dashboard 的 **Identity** 页面，点击用户邮箱旁边的 **"Reset password"**。

### Q: 如何添加更多用户？

在 Netlify Dashboard 的 **Identity** 页面，点击 **"Invite users"**，输入新用户邮箱即可。

### Q: 本地开发时怎么测试？

本地开发时，Git Gateway 无法工作。你可以：

1. 使用 GitHub OAuth 进行本地测试（临时切换 backend）
2. 或者使用 Netlify Dev CLI：

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 启动本地开发服务器
netlify dev
```

### Q: 如何禁用公开注册？

在 Netlify Dashboard → **Identity** → **Registration preferences** → 选择 **"Invite only"**。

### Q: 如何自定义登录页面样式？

Netlify Identity 的登录弹窗样式可以通过 CSS 自定义。在 `static/admin/index.html` 中添加：

```html
<style>
  .netlify-identity-ui {
    --background: #0a0a0a;
    --color: #fff;
    --accent: #2563eb;
  }
</style>
```

## 📝 完整流程图

```
用户访问 /admin/
    ↓
点击 "Login with Netlify Identity"
    ↓
输入邮箱 + 密码
    ↓
Netlify 验证身份
    ↓
Git Gateway 签发 Token
    ↓
Decap CMS 获得 GitHub 写入权限
    ↓
可以在后台编辑文章、上传图片
    ↓
保存后 Git Gateway 提交到 GitHub
    ↓
Netlify 自动构建部署
```

## 🎯 总结

| 认证方式 | 优点 | 缺点 |
|----------|------|------|
| GitHub OAuth | 无需额外服务 | 需要 GitHub 帐号 |
| **Git Gateway** | **帐号密码登录，简单易用** | **需要 Netlify 免费服务** |

使用 Git Gateway 后，你的博客后台将支持：
- ✅ 帐号密码登录（不需要 GitHub 帐号）
- ✅ 多用户管理（邀请制）
- ✅ 密码找回功能
- ✅ 安全的 Token 管理
