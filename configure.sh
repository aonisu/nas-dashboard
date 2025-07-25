#!/bin/bash

# 🚀 NAS Dashboard 自动配置脚本
echo "🚀 NAS Dashboard 自动配置向导"
echo "================================"

# 获取用户输入
echo ""
read -p "请输入您的 GitHub 用户名: " GITHUB_USERNAME
read -p "请输入您的 Docker Hub 用户名: " DOCKER_USERNAME

if [ -z "$GITHUB_USERNAME" ] || [ -z "$DOCKER_USERNAME" ]; then
    echo "❌ 错误: 用户名不能为空"
    exit 1
fi

echo ""
echo "📋 配置信息确认:"
echo "   GitHub 用户名: $GITHUB_USERNAME"
echo "   Docker Hub 用户名: $DOCKER_USERNAME"
echo ""

read -p "确认配置信息正确? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "配置已取消"
    exit 0
fi

echo "🔧 正在更新配置文件..."

# 更新 install.sh
if [ -f "install.sh" ]; then
    sed -i.bak "s/yourusername/$GITHUB_USERNAME/g" install.sh
    sed -i.bak "s/yourname/$DOCKER_USERNAME/g" install.sh
    echo "✅ 更新 install.sh"
fi

# 更新 docker-compose.hub.yml
if [ -f "docker-compose.hub.yml" ]; then
    sed -i.bak "s/yourusername/$DOCKER_USERNAME/g" docker-compose.hub.yml
    sed -i.bak "s/yourname/$DOCKER_USERNAME/g" docker-compose.hub.yml
    echo "✅ 更新 docker-compose.hub.yml"
fi

# 更新 README.md
if [ -f "README.md" ]; then
    sed -i.bak "s/yourusername/$GITHUB_USERNAME/g" README.md
    sed -i.bak "s/yourname/$DOCKER_USERNAME/g" README.md
    echo "✅ 更新 README.md"
fi

# 更新文档文件
for file in *.md; do
    if [ -f "$file" ]; then
        sed -i.bak "s/yourusername/$GITHUB_USERNAME/g" "$file"
        sed -i.bak "s/yourname/$DOCKER_USERNAME/g" "$file"
        sed -i.bak "s/YOUR_USERNAME/$GITHUB_USERNAME/g" "$file"
    fi
done

echo "✅ 更新所有文档文件"

# 清理备份文件
find . -name "*.bak" -delete
echo "✅ 清理备份文件"

# 更新 Git 远程仓库
echo ""
echo "🔗 配置 Git 远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/nas-dashboard.git"
echo "✅ Git 远程仓库已配置"

# 提交更改
echo ""
echo "📝 提交配置更改..."
git add .
git commit -m "🔧 Configure usernames for GitHub and Docker Hub

- GitHub: $GITHUB_USERNAME  
- Docker Hub: $DOCKER_USERNAME
- Updated all configuration files
- Ready for automatic deployment"

echo "✅ 配置更改已提交"

echo ""
echo "🎉 配置完成！"
echo ""
echo "📋 下一步操作:"
echo "1. 推送代码到 GitHub:"
echo "   git push -u origin main"
echo ""
echo "2. 在 GitHub 仓库中配置 Secrets:"
echo "   - DOCKER_USERNAME: $DOCKER_USERNAME"
echo "   - DOCKER_PASSWORD: <您的Docker Hub访问令牌>"
echo ""
echo "3. 推送后 GitHub Actions 将自动构建并发布 Docker 镜像"
echo ""
echo "4. 用户可以通过以下方式安装:"
echo "   curl -fsSL https://raw.githubusercontent.com/$GITHUB_USERNAME/nas-dashboard/main/install.sh | bash"
echo ""
echo "🌍 项目地址: https://github.com/$GITHUB_USERNAME/nas-dashboard"
echo "🐳 Docker 镜像: $DOCKER_USERNAME/nas-dashboard:latest"