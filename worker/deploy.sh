#!/bin/bash
# =============================================================================
# 一键部署脚本 — Cloudflare Worker + 博客部署
# 使用方法: chmod +x deploy.sh && ./deploy.sh
# =============================================================================

set -e

echo "🚀 博客 CMS 一键部署脚本"
echo "=========================="
echo ""

# 检查依赖
command -v wrangler >/dev/null 2>&1 || {
  echo "❌ 请先安装 wrangler: npm install -g wrangler"
  exit 1
}

# 登录 Cloudflare
echo "📋 步骤 1/6: 登录 Cloudflare"
wrangler login
echo "✅ Cloudflare 登录成功"
echo ""

# 创建 KV 命名空间
echo "📋 步骤 2/6: 创建 KV 存储空间"
echo "正在创建 SESSIONS KV..."
SESSIONS_ID=$(wrangler kv:namespace create "SESSIONS" 2>&1 | grep -oP 'id = "\K[^"]+')
echo "✅ SESSIONS KV 创建成功 (ID: $SESSIONS_ID)"

echo "正在创建 AUTH_CREDENTIALS KV..."
AUTH_ID=$(wrangler kv:namespace create "AUTH_CREDENTIALS" 2>&1 | grep -oP 'id = "\K[^"]+')
echo "✅ AUTH_CREDENTIALS KV 创建成功 (ID: $AUTH_ID)"
echo ""

# 更新 wrangler.toml
echo "📋 步骤 3/6: 更新 Worker 配置"
sed -i "s/你的SESSIONS_KV_ID/$SESSIONS_ID/g" wrangler.toml
sed -i "s/你的AUTH_CREDENTIALS_KV_ID/$AUTH_ID/g" wrangler.toml
echo "✅ 配置已更新"
echo ""

# 设置管理员帐号
echo "📋 步骤 4/6: 设置管理员帐号"
read -p "请输入管理员帐号: " ADMIN_USER
read -s -p "请输入管理员密码: " ADMIN_PASS
echo ""

wrangler kv:key put --binding=AUTH_CREDENTIALS "admin" "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}"
echo "✅ 管理员帐号设置成功"
echo ""

# 设置 GitHub Token
echo "📋 步骤 5/6: 设置 GitHub Token"
read -s -p "请输入 GitHub Personal Access Token (ghp_...): " GH_TOKEN
echo ""
echo "$GH_TOKEN" | wrangler secret put GITHUB_TOKEN
echo "✅ GitHub Token 设置成功"
echo ""

# 部署 Worker
echo "📋 步骤 6/6: 部署 Worker"
wrangler deploy
echo "✅ Worker 部署成功"
echo ""

echo "🎉 部署完成！"
echo ""
echo "📝 后续步骤:"
echo "1. 将 Worker 地址填入 static/admin/config.yml 的 base_url"
echo "2. 推送到 GitHub: git push"
echo "3. 访问 https://你的Worker地址/admin/login 登录"
echo "4. 帐号: $ADMIN_USER"
echo ""
echo "💡 提示: Worker 地址可在 Cloudflare Dashboard → Workers 中查看"
