# 🔐 Cloudflare 纯净部署指南（无第三方）

本指南帮助你只用 **Cloudflare + GitHub** 部署博客，实现帐号密码登录后台。

## 📋 架构说明

```
用户浏览器
    ↓
Cloudflare Worker（帐号密码验证）
    ↓ 登录成功
Cloudflare Pages（静态博客）
    ↓ 编辑内容
Cloudflare Worker（代理 GitHub API）
    ↓ 写入内容
GitHub 仓库（存储 Markdown 文件）
```

**核心组件：**
- **Cloudflare Pages** — 托管静态博客
- **Cloudflare Worker** — 处理帐号密码认证
- **Cloudflare KV** — 存储帐号密码和登录状态
- **GitHub** — 存储博客内容（Markdown）

## 🚀 部署步骤

### 第一步：准备工具

```bash
# 安装 Node.js（如果没有）
# https://nodejs.org/

# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

### 第二步：部署 Worker（认证服务）

```bash
cd worker

# 1. 创建 KV 存储空间
wrangler kv:namespace create "SESSIONS"
# 记录输出的 ID，如: id = "xxxxxxxxxxxx"

wrangler kv:namespace create "AUTH_CREDENTIALS"
# 记录输出的 ID，如: id = "yyyyyyyyyyyy"

# 2. 更新 wrangler.toml
# 将上面获得的 ID 填入 wrangler.toml

# 3. 设置管理员帐号
wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" '{"username":"你的帐号","password":"你的密码"}'

# 4. 部署 Worker
wrangler deploy
```

部署成功后会显示 Worker 地址，如：
```
https://blog-cms-auth.你的子域.workers.dev
```

### 第三步：部署博客到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create**
3. 选择 **Pages** → **Connect to Git**
4. 选择 GitHub → 授权 → 选择 **blog-cms** 仓库
5. 配置构建设置：

| 设置项 | 值 |
|--------|-----|
| Branch | `main` |
| Build command | `hugo --minify` |
| Build output directory | `public` |

6. 在 **Environment variables** 中添加：
   ```
   HUGO_VERSION = 0.139.0
   ```

7. 点击 **Save and Deploy**

### 第四步：配置后台认证

编辑 `static/admin/config.yml`，修改 backend 部分：

```yaml
backend:
  name: github
  repo: fbwe425/blog-cms
  branch: main
  base_url: https://你的Worker地址.workers.dev  # Worker 地址
```

### 第五步：推送到 GitHub

```bash
cd blog-cms
git add .
git commit -m "feat: 配置 Cloudflare Worker 认证"
git push
```

### 第六步：访问后台

1. 打开你的博客地址，如：`https://blog-cms.pages.dev/admin/`
2. 会跳转到 Worker 的登录页面
3. 输入你设置的帐号和密码
4. 登录成功后即可使用后台管理

## 🔧 管理员帐号管理

### 修改密码

```bash
# 更新 KV 中的密码
wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" '{"username":"新帐号","password":"新密码"}'
```

### 添加更多用户

```bash
# 添加用户 user2
wrangler kv:key put --binding=AUTH_CREDENTIALS "user2" '{"username":"user2","password":"密码2"}'
```

### 删除用户

```bash
wrangler kv:key delete --binding=AUTH_CREDENTIALS "user2"
```

### 查看所有用户

```bash
wrangler kv:key list --binding=AUTH_CREDENTIALS
```

## 📁 项目结构

```
blog-cms/
├── worker/                    # Cloudflare Worker
│   ├── index.js               # Worker 代码
│   ├── wrangler.toml          # Worker 配置
│   └── deploy.sh              # 一键部署脚本
├── static/admin/              # Decap CMS
│   ├── index.html             # CMS 入口
│   └── config.yml             # CMS 配置（连接 Worker）
├── content/                   # 博客内容
├── layouts/                   # Hugo 布局
└── hugo.toml                  # Hugo 配置
```

## ❓ 常见问题

### Q: Worker 和 Pages 是分开的吗？

是的，它们是两个独立的 Cloudflare 服务：
- **Pages** 托管静态博客文件
- **Worker** 处理登录认证

它们通过域名组合在一起工作。

### Q: 登录状态会过期吗？

会。Session 默认 24 小时过期，过期后需要重新登录。

### Q: 密码存储安全吗？

密码存储在 Cloudflare KV 中，Cloudflare 负责加密存储。但我们建议：
- 使用强密码
- 定期更换密码
- 不要在多个地方使用相同密码

### Q: 如何查看登录日志？

目前 Worker 没有内置日志功能。你可以在 Cloudflare Dashboard → Workers → 日志中查看。

### Q: 本地开发时怎么测试？

本地开发时，Worker 无法工作。你可以：
1. 临时使用 GitHub OAuth（修改 config.yml）
2. 或者用 `wrangler dev` 启动本地 Worker

```bash
cd worker
wrangler dev
```

## 🎯 总结

使用此方案，你只需要：
- ✅ **Cloudflare 帐号**（免费）
- ✅ **GitHub 帐号**（已有）

不需要：
- ❌ Netlify
- ❌ Vercel
- ❌ 其他第三方服务

所有认证和部署都在 Cloudflare 内完成。
