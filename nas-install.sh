#!/bin/bash

# NAS Dashboard 一键安装脚本
echo "🚀 NAS Dashboard 一键安装"
echo "========================"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  建议使用 root 权限运行，或确保当前用户在 docker 组中"
fi

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请在群晖 DSM 中安装 Container Manager 套件"
    exit 1
fi

# 获取当前目录
INSTALL_DIR=$(pwd)
echo "📁 安装目录: $INSTALL_DIR"

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p ./data
chmod 755 ./data

# 选择构建方式
echo ""
echo "请选择构建方式:"
echo "1) 标准构建 (需要良好的网络连接)"
echo "2) 本地构建 (适合网络不佳的环境)"
echo "3) 仅导出现有镜像"
echo ""
read -p "请选择 (1-3): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo "🔨 使用标准 Dockerfile 构建..."
        DOCKERFILE="Dockerfile"
        ;;
    2)
        echo "🔨 使用本地 Dockerfile 构建..."
        DOCKERFILE="Dockerfile.local"
        ;;
    3)
        echo "📦 导出现有镜像..."
        if docker images | grep -q "nas-dashboard"; then
            docker save -o nas-dashboard.tar nas-dashboard:latest
            if [ $? -eq 0 ]; then
                echo "✅ 镜像导出成功: nas-dashboard.tar"
                echo "📊 文件大小: $(ls -lh nas-dashboard.tar | awk '{print $5}')"
                exit 0
            else
                echo "❌ 镜像导出失败"
                exit 1
            fi
        else
            echo "❌ 未找到 nas-dashboard 镜像，请先构建"
            exit 1
        fi
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

# 构建镜像
echo "🚀 开始构建镜像 (这可能需要几分钟)..."
docker build -f $DOCKERFILE -t nas-dashboard:latest .

if [ $? -ne 0 ]; then
    echo "❌ 镜像构建失败"
    echo ""
    echo "💡 建议解决方案:"
    echo "1. 检查网络连接: ping registry-1.docker.io"
    echo "2. 尝试本地构建: 选择选项 2"
    echo "3. 检查磁盘空间: df -h"
    exit 1
fi

echo "✅ 镜像构建成功"

# 导出镜像
echo "📦 导出镜像为 tar 文件..."
docker save -o nas-dashboard.tar nas-dashboard:latest

if [ $? -eq 0 ]; then
    echo "✅ 镜像导出成功!"
    echo ""
    echo "📊 文件信息:"
    ls -lh nas-dashboard.tar
    echo ""
    echo "🎯 Container Manager 导入步骤:"
    echo "1. 打开 Container Manager"
    echo "2. 点击 '映像' 标签页"
    echo "3. 点击 '新增' → '从文件新增'"
    echo "4. 选择文件: $INSTALL_DIR/nas-dashboard.tar"
    echo "5. 导入完成后点击 '启动' 按钮"
    echo ""
    echo "📋 容器配置参数:"
    echo "   端口: 3000:3000"
    echo "   存储装载1: $INSTALL_DIR/data:/app/data"
    echo "   存储装载2: /var/run/docker.sock:/var/run/docker.sock (只读)"
    echo "   环境变量:"
    echo "     NODE_ENV=production"
    echo "     PORT=3000"
    echo "     DB_PATH=/app/data/database.sqlite"
    echo "     TZ=Asia/Shanghai"
    echo ""
    echo "🌍 访问地址: http://$(hostname -I | awk '{print $1}'):3000"
    
else
    echo "❌ 镜像导出失败"
    exit 1
fi

# 询问是否直接启动
echo ""
read -p "是否现在直接启动容器? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 启动容器..."
    
    # 停止现有容器
    docker stop nas-dashboard 2>/dev/null || true
    docker rm nas-dashboard 2>/dev/null || true
    
    # 启动新容器
    docker run -d \
        --name nas-dashboard \
        --restart unless-stopped \
        -p 3000:3000 \
        -v "$INSTALL_DIR/data:/app/data" \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        -e NODE_ENV=production \
        -e PORT=3000 \
        -e DB_PATH=/app/data/database.sqlite \
        -e TZ=Asia/Shanghai \
        nas-dashboard:latest
    
    if [ $? -eq 0 ]; then
        echo "✅ 容器启动成功!"
        echo ""
        sleep 5
        echo "🔍 健康检查..."
        if curl -s -f "http://localhost:3000/api/system/info" >/dev/null 2>&1; then
            echo "✅ 服务运行正常"
            echo "🌍 访问地址: http://$(hostname -I | awk '{print $1}'):3000"
        else
            echo "⚠️  服务可能还在启动中，请稍后访问"
        fi
    else
        echo "❌ 容器启动失败"
        echo "查看日志: docker logs nas-dashboard"
    fi
else
    echo "💡 您可以稍后使用以下命令启动容器:"
    echo "docker run -d --name nas-dashboard --restart unless-stopped -p 3000:3000 -v $INSTALL_DIR/data:/app/data -v /var/run/docker.sock:/var/run/docker.sock:ro -e NODE_ENV=production -e PORT=3000 -e DB_PATH=/app/data/database.sqlite -e TZ=Asia/Shanghai nas-dashboard:latest"
fi

echo ""
echo "🎉 安装完成!"
echo "📦 镜像文件: nas-dashboard.tar (可用于 Container Manager 导入)"