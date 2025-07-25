#!/bin/bash

# NAS Dashboard 一键安装脚本
# 支持从 Docker Hub 或 GitHub 直接安装

set -e

echo "🚀 NAS Dashboard 一键安装脚本"
echo "=================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请在群晖 DSM 中安装 Container Manager 套件"
    exit 1
fi

# 配置变量
CONTAINER_NAME="nas-dashboard"
IMAGE_NAME="aonisu/nas-dashboard:latest"
DATA_DIR="/volume1/docker/nas-dashboard/data"
PORT="3000"

echo "📋 安装配置:"
echo "   镜像: $IMAGE_NAME"
echo "   容器: $CONTAINER_NAME"
echo "   端口: $PORT"
echo "   数据: $DATA_DIR"
echo ""

# 询问是否继续
read -p "是否继续安装? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "安装已取消"
    exit 0
fi

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p "$DATA_DIR"
chmod 755 "$DATA_DIR"

# 停止并删除现有容器
echo "🛑 清理现有容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 拉取最新镜像
echo "📥 拉取最新镜像..."
docker pull $IMAGE_NAME

# 启动容器
echo "🚀 启动容器..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:3000 \
    -v "$DATA_DIR:/app/data" \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -e NODE_ENV=production \
    -e PORT=3000 \
    -e DB_PATH=/app/data/database.sqlite \
    -e TZ=Asia/Shanghai \
    $IMAGE_NAME

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 健康检查
echo "🔍 健康检查..."
if curl -s -f "http://localhost:$PORT/api/system/info" >/dev/null 2>&1; then
    echo "✅ 安装成功！"
    echo ""
    echo "🌍 访问地址:"
    echo "   http://$(hostname -I | awk '{print $1}' 2>/dev/null || echo 'localhost'):$PORT"
    echo ""
    echo "🔧 管理命令:"
    echo "   查看状态: docker ps | grep $CONTAINER_NAME"
    echo "   查看日志: docker logs -f $CONTAINER_NAME"
    echo "   重启服务: docker restart $CONTAINER_NAME"
    echo "   停止服务: docker stop $CONTAINER_NAME"
    echo "   更新镜像: docker pull $IMAGE_NAME && docker restart $CONTAINER_NAME"
    echo ""
    echo "📁 数据目录: $DATA_DIR"
else
    echo "⚠️  服务可能还在启动中"
    echo "请稍后访问或查看日志: docker logs $CONTAINER_NAME"
fi

echo ""
echo "🎉 安装完成！"