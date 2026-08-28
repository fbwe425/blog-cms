---
title: "Hugo 博客搭建指南：从零开始"
date: 2024-12-22T14:30:00+08:00
draft: false
description: "一篇详细的 Hugo 博客搭建教程，包括安装、配置、主题选择和部署"
tags: ["Hugo", "教程", "博客"]
categories: ["技术"]
cover:
  image: ""
  alt: ""
  hidden: true
---

## 📖 简介

Hugo 是一个用 Go 语言编写的静态网站生成器，以极快的构建速度著称。本文将带你从零开始搭建一个功能完整的博客。

## 🛠️ 安装 Hugo

### macOS

```bash
brew install hugo
```

### Linux

```bash
# Debian/Ubuntu
sudo apt install hugo

# 或使用 snap
sudo snap install hugo
```

### Windows

```bash
choco install hugo-extended
```

### 验证安装

```bash
hugo version
```

## 📝 创建新站点

```bash
hugo new site my-blog
cd my-blog
```

## 🎨 安装主题

推荐使用 PaperMod 主题：

```bash
git init
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

## ⚙️ 基础配置

编辑 `hugo.toml`：

```toml
baseURL = "https://your-domain.com/"
languageCode = "zh-cn"
title = "我的博客"
theme = "papermod"
```

## 📄 创建文章

```bash
hugo new content posts/my-first-post.md
```

编辑生成的 Markdown 文件，修改 front matter 中的 `draft: true` 为 `draft: false`。

## 🚀 本地预览

```bash
hugo server -D
```

浏览器打开 `http://localhost:1313/` 即可预览。

## 📦 构建生产版本

```bash
hugo --minify
```

生成的文件在 `public/` 目录中。

## 🔗 部署

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy Hugo
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### Vercel

项目根目录添加 `vercel.json`：

```json
{
  "buildCommand": "hugo --minify",
  "outputDirectory": "public",
  "framework": "hugo"
}
```

### Cloudflare Pages

在 Cloudflare Dashboard 中设置：
- Build command: `hugo --minify`
- Build output directory: `public`

## 📝 总结

Hugo 是一个优秀的博客框架，配合 Decap CMS 可以实现方便的后台管理。希望这篇教程对你有帮助！
