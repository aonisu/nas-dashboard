#!/bin/bash

# NAS Dashboard 启动脚本
echo "🚀 启动 NAS 管理平台..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ 错误: Docker 未运行或无法访问"
    echo "请确保 Docker 已安装并正在运行"
    exit 1
fi

# 检查 docker-compose 是否可用
if ! command -v docker-compose &> /dev/null; then
    if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
        echo "❌ 错误: docker-compose 或 docker compose 命令不可用"
        echo "请安装 Docker Compose"
        exit 1
    fi
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p ./data

# 设置数据目录权限
chmod 755 ./data

# 停止现有容器（如果存在）
echo "🛑 停止现有容器..."
$COMPOSE_CMD down

# 构建并启动服务
echo "🔨 构建并启动服务..."
$COMPOSE_CMD up -d --build

# 检查服务状态
echo "⏳ 等待服务启动..."
sleep 10

if $COMPOSE_CMD ps | grep -q "Up"; then
    echo "✅ NAS 管理平台启动成功！"
    echo ""
    echo "📊 访问地址: http://localhost:3000"
    echo "🐳 Docker 管理: http://localhost:3000/docker"
    echo "⚙️  系统设置: http://localhost:3000/settings"
    echo ""
    echo "📝 查看日志: $COMPOSE_CMD logs -f"
    echo "🛑 停止服务: $COMPOSE_CMD down"
else
    echo "❌ 服务启动失败，请检查日志："
    $COMPOSE_CMD logs
    exit 1
fi