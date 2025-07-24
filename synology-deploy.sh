#!/bin/bash

# 群晖 NAS 一键部署脚本
echo "🚀 群晖 NAS Dashboard 一键部署"
echo "================================="

# 检查是否在群晖系统上运行
if [ ! -f "/etc/synoinfo.conf" ]; then
    echo "⚠️  警告: 这不是群晖系统，但仍可继续部署"
fi

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请在 DSM 套件中心安装 Container Manager"
    exit 1
fi

# 获取当前路径
CURRENT_DIR=$(pwd)
echo "📁 当前目录: $CURRENT_DIR"

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p ./data
chmod 755 ./data

# 检查必要文件
echo "🔍 检查必要文件..."
MISSING_FILES=()

if [ ! -f "Dockerfile" ]; then
    MISSING_FILES+=("Dockerfile")
fi

if [ ! -f "docker-compose.yml" ]; then
    MISSING_FILES+=("docker-compose.yml")
fi

if [ ! -d "client" ]; then
    MISSING_FILES+=("client/")
fi

if [ ! -d "server" ]; then
    MISSING_FILES+=("server/")
fi

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "❌ 缺少必要文件:"
    printf '%s\n' "${MISSING_FILES[@]}"
    echo "请确保已完整上传项目文件"
    exit 1
fi

echo "✅ 文件检查完成"

# 选择部署方式
echo ""
echo "请选择部署方式:"
echo "1) Docker Compose (推荐)"
echo "2) 仅构建镜像 (用于 Container Manager)"
echo "3) 完整部署 + 构建镜像"

read -p "请选择 (1-3): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo "🔨 使用 Docker Compose 部署..."
        
        # 检查 docker-compose 命令
        if command -v docker-compose &> /dev/null; then
            COMPOSE_CMD="docker-compose"
        elif docker compose version &> /dev/null 2>&1; then
            COMPOSE_CMD="docker compose"
        else
            echo "❌ 错误: docker-compose 不可用"
            exit 1
        fi
        
        # 停止现有服务
        echo "🛑 停止现有服务..."
        $COMPOSE_CMD down 2>/dev/null || true
        
        # 构建并启动
        echo "🚀 构建并启动服务..."
        $COMPOSE_CMD up -d --build
        
        if [ $? -eq 0 ]; then
            echo "✅ 部署成功！"
        else
            echo "❌ 部署失败"
            exit 1
        fi
        ;;
        
    2)
        echo "🔨 仅构建 Docker 镜像..."
        
        # 构建镜像
        docker build -t nas-dashboard:latest .
        
        if [ $? -eq 0 ]; then
            echo "✅ 镜像构建成功！"
            echo ""
            echo "📋 Container Manager 配置信息:"
            echo "   镜像名称: nas-dashboard:latest"
            echo "   端口映射: 3000:3000"
            echo "   存储映射: $CURRENT_DIR/data:/app/data"
            echo "   Docker Socket: /var/run/docker.sock:/var/run/docker.sock:ro"
        else
            echo "❌ 镜像构建失败"
            exit 1
        fi
        ;;
        
    3)
        echo "🔨 完整部署..."
        
        # 构建镜像
        echo "📦 构建镜像..."
        docker build -t nas-dashboard:latest .
        
        if [ $? -ne 0 ]; then
            echo "❌ 镜像构建失败"
            exit 1
        fi
        
        # 停止现有容器
        echo "🛑 停止现有容器..."
        docker stop nas-dashboard 2>/dev/null || true
        docker rm nas-dashboard 2>/dev/null || true
        
        # 启动容器
        echo "🚀 启动容器..."
        docker run -d \
          --name nas-dashboard \
          --restart unless-stopped \
          -p 3000:3000 \
          -v "$CURRENT_DIR/data:/app/data" \
          -v /var/run/docker.sock:/var/run/docker.sock:ro \
          -e NODE_ENV=production \
          -e PORT=3000 \
          -e DB_PATH=/app/data/database.sqlite \
          -e TZ=Asia/Shanghai \
          nas-dashboard:latest
        
        if [ $? -eq 0 ]; then
            echo "✅ 容器启动成功！"
        else
            echo "❌ 容器启动失败"
            exit 1
        fi
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 获取本机 IP 地址
LOCAL_IP=$(ip route get 1 2>/dev/null | head -1 | cut -d' ' -f7)
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="你的NAS_IP"
fi

# 健康检查
echo "🔍 健康检查..."
if curl -s -f "http://localhost:3000/api/system/info" >/dev/null 2>&1; then
    echo "✅ 服务运行正常"
    
    echo ""
    echo "🎉 部署完成！"
    echo "================================="
    echo "🌍 访问地址:"
    echo "   http://$LOCAL_IP:3000"
    echo "   http://localhost:3000"
    echo ""
    echo "🔧 管理命令:"
    if [ "$REPLY" = "1" ]; then
        echo "   查看状态: docker-compose ps"
        echo "   查看日志: docker-compose logs -f"
        echo "   重启服务: docker-compose restart"
        echo "   停止服务: docker-compose down"
    else
        echo "   查看状态: docker ps | grep nas-dashboard"
        echo "   查看日志: docker logs -f nas-dashboard"
        echo "   重启服务: docker restart nas-dashboard"
        echo "   停止服务: docker stop nas-dashboard"
    fi
    echo ""
    echo "📁 数据目录: $CURRENT_DIR/data"
    
else
    echo "⚠️  服务可能还在启动中，请稍等片刻后访问"
    echo "   如果问题持续，请运行以下命令查看日志:"
    if [ "$REPLY" = "1" ]; then
        echo "   docker-compose logs"
    else
        echo "   docker logs nas-dashboard"
    fi
fi