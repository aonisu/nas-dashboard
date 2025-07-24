#!/bin/bash

# 快速构建脚本 - 在群晖 NAS 上运行
echo "🚀 NAS Dashboard 快速构建脚本"
echo "================================"

# 检查当前目录
if [ ! -f "Dockerfile" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    echo "确保包含: Dockerfile, client/, server/ 目录"
    exit 1
fi

# 创建数据目录
mkdir -p ./data
chmod 755 ./data

echo "📦 开始构建 Docker 镜像..."
echo "⏳ 这个过程可能需要 5-10 分钟..."

# 尝试标准构建
echo "🔨 尝试标准构建..."
docker build -t nas-dashboard:latest . --no-cache

if [ $? -eq 0 ]; then
    echo "✅ 标准构建成功!"
else
    echo "⚠️  标准构建失败，尝试本地构建..."
    
    # 使用本地 Dockerfile
    if [ -f "Dockerfile.local" ]; then
        docker build -f Dockerfile.local -t nas-dashboard:latest . --no-cache
        
        if [ $? -eq 0 ]; then
            echo "✅ 本地构建成功!"
        else
            echo "❌ 构建失败"
            echo "💡 请检查网络连接或联系技术支持"
            exit 1
        fi
    else
        echo "❌ 未找到 Dockerfile.local，构建失败"
        exit 1
    fi
fi

# 导出镜像
echo "📦 导出镜像为 tar 文件..."
docker save -o nas-dashboard.tar nas-dashboard:latest

if [ $? -eq 0 ]; then
    echo "✅ 镜像导出成功!"
    echo ""
    echo "📊 文件信息:"
    ls -lh nas-dashboard.tar
    echo ""
    echo "🎯 下一步操作:"
    echo "1. 打开 Container Manager"
    echo "2. 点击 '映像' → '新增' → '从文件新增'"
    echo "3. 选择: $(pwd)/nas-dashboard.tar"
    echo "4. 导入完成后点击镜像的 '启动' 按钮"
    echo ""
    echo "📋 容器配置参数:"
    echo "   容器名称: nas-dashboard"
    echo "   端口映射: 3000:3000"
    echo "   存储装载1: $(pwd)/data:/app/data"
    echo "   存储装载2: /var/run/docker.sock:/var/run/docker.sock (只读)"
    echo "   环境变量:"
    echo "     NODE_ENV=production"
    echo "     PORT=3000"
    echo "     DB_PATH=/app/data/database.sqlite"
    echo "     TZ=Asia/Shanghai"
    echo ""
    echo "🌍 完成后访问: http://$(hostname -I | awk '{print $1}' 2>/dev/null || echo '你的NAS_IP'):3000"
    
else
    echo "❌ 镜像导出失败"
    exit 1
fi

echo ""
echo "🎉 构建完成!"
echo "📦 请使用 nas-dashboard.tar 文件在 Container Manager 中导入"