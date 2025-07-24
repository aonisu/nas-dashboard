#!/bin/bash

# 最小化构建脚本 - 适用于网络问题环境
echo "🔨 最小化 Docker 镜像构建"

# 创建最简单的 Dockerfile
cat > Dockerfile.minimal << 'EOF'
# 使用已经下载的基础镜像
FROM node:18-alpine

WORKDIR /app

# 先复制 package.json
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# 安装依赖 - 使用国内源
RUN npm config set registry https://registry.npmmirror.com && \
    npm install && \
    cd client && npm install && \
    cd ../server && npm install

# 复制源代码
COPY . .

# 构建应用
RUN cd client && npm run build && \
    cd ../server && npm run build && \
    cp -r ../client/dist ./dist/client

# 创建数据目录
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
EOF

echo "📦 使用最小化 Dockerfile 构建..."

# 尝试构建
docker build -f Dockerfile.minimal -t nas-dashboard:latest .

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    
    # 导出镜像
    echo "📤 导出镜像文件..."
    docker save -o nas-dashboard.tar nas-dashboard:latest
    
    if [ $? -eq 0 ]; then
        echo "🎉 成功！"
        echo "文件: nas-dashboard.tar"
        echo "大小: $(ls -lh nas-dashboard.tar | awk '{print $5}')"
        echo ""
        echo "📋 Container Manager 导入步骤："
        echo "1. Container Manager → 映像 → 新增 → 从文件新增"
        echo "2. 选择 nas-dashboard.tar"
        echo "3. 导入后点击启动配置容器"
    else
        echo "❌ 导出失败"
    fi
else
    echo "❌ 构建失败"
    echo "💡 请在群晖 NAS 上重试"
fi