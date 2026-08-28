# 🚀 Cloudflare Pages 部署指南

## 步骤 1：连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择 GitHub → 授权 → 选择 **blog-cms** 仓库

## 步骤 2：配置构建设置

| 设置项 | 值 |
|--------|-----|
| Branch | `main` |
| Build command | `hugo --minify` |
| Build output directory | `public` |

## 步骤 3：创建 KV 命名空间

在 Cloudflare Dashboard 中：

1. 进入 **Workers & Pages** → **KV**
2. 点击 **Create a namespace**
3. 创建两个命名空间：
   - 名称：`SESSIONS`（用于存储登录会话）
   - 名称：`AUTH_CREDENTIALS`（用于存储帐号密码）

## 步骤 4：配置 KV 绑定

1. 进入 **Workers & Pages** → **你的项目 blog-cms**
2. 点击 **Settings** → **Functions** → **KV namespace bindings**
3. 点击 **Add binding**
4. 添加两个绑定：
   - Variable name: `SESSIONS`，KV namespace: 选择 `SESSIONS`
   - Variable name: `AUTH_CREDENTIALS`，KV namespace: 选择 `AUTH_CREDENTIALS`

## 步骤 5：设置管理员帐号

在 Cloudflare Dashboard 中：

1. 进入 **Workers & Pages** → **KV**
2. 点击 `AUTH_CREDENTIALS` 命名空间
3. 点击 **Create a key**
4. Key: `admin`，Value: `{"username":"admin","password":"你的密码"}`

或者使用 Wrangler CLI：

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 设置管理员帐号
wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" '{"username":"admin","password":"你的密码"}'
```

## 步骤 6：部署

1. 配置完成后，Cloudflare Pages 会自动部署
2. 访问 `https://blog-cms-7z1.pages.dev/admin/`
3. 输入管理员帐号和密码登录

## 步骤 7：自定义域名（可选）

1. 进入 **Workers & Pages** → **你的项目** → **Custom domains**
2. 点击 **Setup a custom domain**
3. 输入你的域名（如 `blog.example.com`）
4. 按照提示配置 DNS

## 常见问题

### Q: 登录后无法进入后台？

检查 KV 绑定是否正确配置：
1. 进入 **Settings** → **Functions** → **KV namespace bindings**
2. 确认 `SESSIONS` 和 `AUTH_CREDENTIALS` 都已绑定

### Q: 如何修改管理员密码？

```bash
wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" '{"username":"admin","password":"新密码"}'
```

### Q: 如何添加更多用户？

```bash
wrangler kv:key put --binding=AUTH_CREDENTIALS "user2" '{"username":"user2","password":"密码2"}'
```

### Q: 如何查看所有用户？

```bash
wrangler kv:key list --binding=AUTH_CREDENTIALS
```

### Q: 如何删除用户？

```bash
wrangler kv:key delete --binding=AUTH_CREDENTIALS "user2"
```
