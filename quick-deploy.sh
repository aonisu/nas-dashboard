#!/bin/bash

# 快速部署脚本 - 适用于群晖 NAS
echo "🚀 快速部署 NAS 管理平台..."

# 检查 Docker 是否可用
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装或不可用"
    echo "请先在 DSM 套件中心安装 Docker 套件"
    exit 1
fi

# 检查 docker-compose 是否可用
if ! command -v docker-compose &> /dev/null; then
    if ! docker compose version &> /dev/null; then
        echo "❌ 错误: docker-compose 不可用"
        echo "请确保 Docker 套件版本支持 Compose"
        exit 1
    fi
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# 创建必要的目录
echo "📁 创建目录结构..."
mkdir -p ./data
chmod 755 ./data

# 设置正确的权限
if [ "$(id -u)" -eq 0 ]; then
    chown -R 1000:1000 ./data
fi

# 检查端口是否被占用
if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "⚠️  警告: 端口 3000 已被占用"
    read -p "是否继续？容器可能无法启动 (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 停止现有服务
echo "🛑 停止现有服务..."
$COMPOSE_CMD down 2>/dev/null || true

# 构建并启动
echo "🔨 构建并启动服务..."
$COMPOSE_CMD up -d --build

# 等待服务启动
echo "⏳ 等待服务启动 (30秒)..."
sleep 30

# 检查服务状态
if $COMPOSE_CMD ps | grep -q "Up"; then
    # 获取本机 IP
    LOCAL_IP=$(ip route get 1 2>/dev/null | head -1 | cut -d' ' -f7)
    [ -z "$LOCAL_IP" ] && LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
    [ -z "$LOCAL_IP" ] && LOCAL_IP="localhost"
    
    echo ""
    echo "✅ NAS 管理平台部署成功！"
    echo ""
    echo "🌍 访问地址:"
    echo "   http://$LOCAL_IP:3000"
    echo "   http://localhost:3000"
    echo ""
    echo "🔧 管理命令:"
    echo "   查看状态: $COMPOSE_CMD ps"
    echo "   查看日志: $COMPOSE_CMD logs -f"
    echo "   重启服务: $COMPOSE_CMD restart"
    echo "   停止服务: $COMPOSE_CMD down"
    echo ""
    
    # 健康检查
    echo "🔍 正在进行健康检查..."
    sleep 5
    if curl -s -f "http://localhost:3000/api/system/info" > /dev/null 2>&1; then
        echo "✅ 健康检查通过 - 服务运行正常"
    else
        echo "⚠️  健康检查失败 - 请检查服务日志"
        echo "运行以下命令查看日志: $COMPOSE_CMD logs"
    fi
    
else
    echo "❌ 部署失败，请检查错误信息："
    echo ""
    $COMPOSE_CMD logs --tail=50
    echo ""
    echo "💡 常见解决方案："
    echo "   1. 检查端口 3000 是否被占用"
    echo "   2. 确保有足够的磁盘空间"
    echo "   3. 检查 Docker 服务是否正常运行"
    echo "   4. 查看完整日志: $COMPOSE_CMD logs"
    exit 1
fi