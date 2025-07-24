#!/bin/bash

# NAS Dashboard 部署脚本
echo "🚀 准备部署 NAS 管理平台到群晖 NAS..."

# 检查必要的文件
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误: docker-compose.yml 文件不存在"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ 错误: Dockerfile 文件不存在"
    exit 1
fi

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p ./data
chmod 755 ./data

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down 2>/dev/null || true

# 清理旧镜像（可选）
read -p "是否清理旧的镜像？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 清理旧镜像..."
    docker image prune -f
    docker rmi $(docker images | grep nas-dashboard | awk '{print $3}') 2>/dev/null || true
fi

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 检查服务状态
if docker-compose ps | grep -q "Up"; then
    echo "✅ NAS 管理平台部署成功！"
    echo ""
    echo "📊 访问地址:"
    echo "   - 内网访问: http://$(hostname -I | awk '{print $1}'):3000"
    echo "   - 本地访问: http://localhost:3000"
    echo ""
    echo "🔧 管理命令:"
    echo "   - 查看日志: docker-compose logs -f"
    echo "   - 重启服务: docker-compose restart"
    echo "   - 停止服务: docker-compose down"
    echo "   - 更新服务: ./deploy-to-nas.sh"
    echo ""
    echo "📁 数据存储: ./data/"
    echo "🔌 端口: 3000"
else
    echo "❌ 部署失败，请检查日志："
    docker-compose logs
    exit 1
fi