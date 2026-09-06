# 📝 Blog CMS

![Version](https://img.shields.io/badge/version-1.3.0-blue?style=flat) ![License](https://img.shields.io/badge/license-MIT-green?style=flat) ![Hugo](https://img.shields.io/badge/Hugo-0.136.0-FF4088?style=flat&logo=hugo) — Hugo + Decap CMS 博客系统

一个功能完整的现代博客系统，支持后台管理、多平台部署。

## ✨ 特性

- **📝 后台管理** — Decap CMS 后台直接编写文章、管理页面
- **🔐 帐号密码登录** — Cloudflare Pages Functions 认证
- **🎨 主题切换** — 亮色 / 暗色 / 自动跟随系统
- **🔍 全文搜索** — 内置搜索功能
- **📱 响应式设计** — 完美适配所有设备
- **🚀 多平台部署** — Cloudflare Pages / Vercel / GitHub Pages
- **📁 Markdown 编写** — 简洁高效的内容创作
- **🔧 后台配置** — 通过后台修改主题、菜单、网站设置

## 🛠️ 技术栈

| 组件 | 技术 |
|------|------|
| 静态站点生成 | [Hugo](https://gohugo.io/) |
| 后台管理 | [Decap CMS](https://decapcms.org/) |
| 认证服务 | [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) |
| 主题 | [PaperMod](https://github.com/adityatelange/hugo-PaperMod/) |
| 部署 | Cloudflare Pages / Vercel / GitHub Pages |

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/fbwe425/blog-cms.git
cd blog-cms
```

### 2. 部署到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择 GitHub → 授权 → 选择 **blog-cms** 仓库
4. 配置构建：

| 设置项 | 值 |
|--------|-----|
| Branch | `main` |
| Build command | `hugo --minify` |
| Build output directory | `public` |

5. 在 **Settings** → **Functions** 中添加 KV 绑定：
   - `SESSIONS` → 选择或创建 KV 命名空间
   - `AUTH_CREDENTIALS` → 选择或创建 KV 命名空间

6. 点击 **Save and Deploy**

### 3. 设置管理员帐号

在 Cloudflare Dashboard 中：

1. 进入 **Workers & Pages** → **你的项目** → **Settings** → **Functions** → **KV namespace bindings**
2. 点击 **Edit variables**，获取 KV 命名空间 ID
3. 使用 Wrangler CLI 或 API 设置管理员帐号：

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 设置管理员帐号
wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" '{"username":"admin","password":"你的密码"}'
```

### 4. 访问后台

1. 打开 `https://你的站点.pages.dev/admin/`
2. 输入管理员帐号和密码
3. 登录成功后即可使用后台管理

## 📁 项目结构

```
blog-cms/
├── functions/                 # Cloudflare Pages Functions
│   └── api/
│       ├── login.js           # 登录处理
│       ├── auth.js            # Session 验证
│       └── logout.js          # 登出处理
├── content/                   # 博客内容
│   ├── posts/                 # 博客文章
│   └── pages/                 # 独立页面
├── static/                    # 静态文件
│   ├── admin/                 # Decap CMS 管理面板
│   │   ├── index.html         # CMS 入口（含登录界面）
│   │   └── config.yml         # CMS 配置
│   └── css/                   # 自定义样式
├── layouts/                   # Hugo 布局模板
├── data/                      # 数据文件（主题/导航配置）
├── archetypes/                # 内容原型
├── hugo.toml                  # Hugo 配置
├── vercel.json                # Vercel 部署配置
├── docs/                      # 部署文档
└── README.md
```

## 📦 其他部署方式

### Vercel

1. 登录 [vercel.com](https://vercel.com)
2. Import GitHub 仓库
3. Framework: Hugo
4. Build command: `hugo --minify`
5. Output: `public`

### GitHub Pages

项目已包含 GitHub Actions 配置（`.github/workflows/deploy-github-pages.yml`）：

1. 进入仓库 Settings → Pages
2. Source 选择 **GitHub Actions**
3. 推送到 `main` 分支自动部署

## 🎨 后台功能

### 写文章

1. 访问 `/admin/`，输入帐号密码登录
2. 点击 **📝 文章管理**
3. 点击 **New posts**
4. 使用 Markdown 编辑器编写内容
5. 保存为草稿或直接发布

支持的功能：
- Markdown 实时预览
- 图片上传和管理
- 标签和分类
- 封面图设置
- 文章目录

### 管理页面

1. 在后台选择 **📄 页面管理**
2. 创建新页面（关于、联系等）
3. 自定义 URL 路径

### 修改主题和网站设置

在后台选择 **⚙️ 网站设置**：

| 设置 | 说明 |
|------|------|
| **基本设置** | 网站标题、描述 |
| **🎨 主题设置** | 亮色/暗色、显示选项、首页信息 |
| **🔗 导航菜单** | 添加、删除、排序菜单项 |

### 管理员帐号管理

```bash
# 修改密码
wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" '{"username":"新帐号","password":"新密码"}'

# 添加用户
wrangler kv:key put --binding=AUTH_CREDENTIALS "user2" '{"username":"user2","password":"密码2"}'

# 删除用户
wrangler kv:key delete --binding=AUTH_CREDENTIALS "user2"

# 查看所有用户
wrangler kv:key list --binding=AUTH_CREDENTIALS
```

## 🔧 本地开发

```bash
# 安装 Hugo（如果没有）
brew install hugo  # macOS
# 或
sudo apt install hugo  # Linux

# 启动开发服务器（包含草稿）
hugo server -D

# 浏览器打开 http://localhost:1313
```

### 常用命令

```bash
# 构建生产版本
hugo --minify

# 创建新文章
hugo new content posts/my-new-post.md

# 更新主题
hugo mod get -u

# 清理构建产物
rm -rf public resources/_gen
```

## 📝 Markdown 写作

### Front Matter 示例

```yaml
---
title: "文章标题"
date: 2024-12-22T14:30:00+08:00
draft: false
description: "文章描述"
tags: ["标签1", "标签2"]
categories: ["技术"]
cover:
  image: ""
  alt: ""
  hidden: false
---
```

### 支持的语法

- **粗体**：`**粗体**`
- *斜体*：`*斜体*`
- `代码`：`` `代码` ``
- [链接](https://example.com)：`[链接](https://example.com)`
- 图片：`![alt](/images/xxx.jpg)`
- 代码块：使用三个反引号
- 表格：使用 Markdown 表格语法
- 引用：使用 `>` 前缀

## ❓ 常见问题

### Q: 后台登录失败怎么办？

1. 检查 Cloudflare Pages Functions 是否正常运行
2. 检查 KV 绑定是否正确配置
3. 检查管理员帐号密码是否正确

### Q: 如何修改密码？

```bash
wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" '{"username":"帐号","password":"新密码"}'
```

### Q: 图片存储在哪里？

默认存储在 `static/images/uploads/` 目录，通过 Decap CMS 上传。

### Q: 如何添加新的分类？

在后台 **📝 文章管理** 中，点击分类下拉框的 **Add** 按钮。

### Q: 本地开发时怎么用后台？

本地开发时 Functions 无法使用。你可以临时修改 `config.yml` 使用 GitHub OAuth。

## 🏗️ 架构说明

```
用户浏览器
    ↓
Cloudflare Pages（静态博客 + Functions）
    ↓ 登录验证
Cloudflare KV（存储帐号密码和 Session）
    ↓ 编辑内容
Decap CMS（后台管理）
    ↓ 写入内容
GitHub 仓库（存储 Markdown 文件）
    ↓ 触发构建
Cloudflare Pages（自动部署）
```

## 📄 许可证

MIT License

## 🙏 致谢

- [Hugo](https://gohugo.io/) — 静态站点生成器
- [Decap CMS](https://decapcms.org/) — 开源内容管理系统
- [PaperMod](https://github.com/adityatelange/hugo-PaperMod/) — 优秀的 Hugo 主题
- [Cloudflare](https://www.cloudflare.com/) — 免费的 CDN、Pages 和 Functions
