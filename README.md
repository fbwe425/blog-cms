# 📝 Blog CMS — Hugo + Decap CMS 博客系统

一个功能完整的现代博客系统，支持后台管理、多平台部署。

## ✨ 特性

- **📝 后台管理** — Decap CMS 后台直接编写文章、管理页面
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
| 主题 | [PaperMod](https://github.com/adityatelange/hugo-PaperMod/) |
| 部署 | GitHub Actions / Vercel / Cloudflare Pages |

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/blog-cms.git
cd blog-cms
```

### 2. 本地开发

```bash
# 安装 Hugo（如果没有）
brew install hugo  # macOS
# 或
sudo apt install hugo  # Linux

# 启动开发服务器
hugo server -D

# 浏览器打开 http://localhost:1313
```

### 3. 配置 Decap CMS 后台

1. **创建 GitHub OAuth 应用**
   - 访问 https://github.com/settings/developers
   - 点击 "New OAuth App"
   - 填写信息：
     - Application name: `Blog CMS`
     - Homepage URL: `https://你的域名.com`
     - Authorization callback URL: `https://decap-oauth.netlify.app/`
   - 保存 Client ID 和 Client Secret

2. **修改配置文件**
   编辑 `static/admin/config.yml`：

   ```yaml
   backend:
     name: github
     repo: 你的用户名/你的仓库名    # 修改为你的仓库
     branch: main
     base_url: https://decap-oauth.netlify.app
   ```

3. **访问后台**
   - 部署后访问 `https://你的域名.com/admin/`
   - 使用 GitHub 账号登录

## 📁 项目结构

```
blog-cms/
├── content/              # 内容目录
│   ├── posts/            # 博客文章
│   └── pages/            # 独立页面
├── static/               # 静态文件
│   ├── admin/            # Decap CMS 管理面板
│   │   ├── index.html    # CMS 入口
│   │   └── config.yml    # CMS 配置
│   └── images/           # 图片资源
├── layouts/              # 布局模板
├── themes/               # 主题（通过 Hugo Modules 管理）
├── data/                 # 数据文件
├── hugo.toml             # Hugo 配置
├── .github/workflows/    # GitHub Actions 部署
├── vercel.json           # Vercel 部署配置
└── wrangler.toml         # Cloudflare Pages 配置
```

## 📦 部署指南

### 方式一：GitHub Pages（推荐）

1. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/blog-cms.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

3. **自动部署**
   推送到 `main` 分支后会自动构建和部署。

### 方式二：Vercel

1. **导入项目**
   - 登录 https://vercel.com
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

2. **配置**
   - Framework Preset: Hugo
   - Build Command: `hugo --minify`
   - Output Directory: `public`

3. **部署**
   每次推送到 `main` 分支会自动部署。

### 方式三：Cloudflare Pages

1. **连接仓库**
   - 登录 Cloudflare Dashboard
   - 进入 Pages
   - 点击 "Create a project"
   - 连接 GitHub 仓库

2. **配置构建**
   - Framework preset: Hugo
   - Build command: `hugo --minify`
   - Build output directory: `public`
   - 环境变量: `HUGO_VERSION = 0.139.0`

3. **部署**
   保存后自动构建部署。

## 🎨 后台功能

### 写文章
1. 访问 `/admin/`
2. 点击 "📝 文章管理"
3. 点击 "New posts"
4. 编写 Markdown 内容
5. 保存为草稿或直接发布

### 管理页面
1. 在后台选择 "📄 页面管理"
2. 创建新页面（如"关于"、"联系"等）

### 修改主题
1. 在后台选择 "⚙️ 网站设置"
2. 选择 "🎨 主题设置"
3. 修改亮色/暗色主题、显示选项等

### 管理菜单
1. 在后台选择 "⚙️ 网站设置"
2. 选择 "🔗 导航菜单"
3. 添加、删除或重新排序菜单项

## 🔧 常用命令

```bash
# 本地开发
hugo server -D

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
categories: ["分类"]
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

## ❓ 常见问题

### Q: 为什么后台访问需要登录？
A: Decap CMS 使用 GitHub OAuth 认证，只有授权用户才能编辑内容。

### Q: 如何自定义主题？
A: 修改 `static/admin/config.yml` 中的 "🎨 主题设置" 部分，或直接编辑 `hugo.toml`。

### Q: 如何添加新的分类？
A: 在后台 "📝 文章管理" 中，点击分类下拉框的 "Add" 按钮。

### Q: 图片存储在哪里？
A: 默认存储在 `static/images/uploads/` 目录。

## 📄 许可证

MIT License

## 🙏 致谢

- [Hugo](https://gohugo.io/) - 静态站点生成器
- [Decap CMS](https://decapcms.org/) - 开源内容管理系统
- [PaperMod](https://github.com/adityatelange/hugo-PaperMod/) - 优秀的 Hugo 主题
