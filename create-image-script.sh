#!/bin/bash

# 创建可用的 Docker 镜像脚本
echo "🚀 创建 NAS Dashboard Docker 镜像..."

# 由于网络问题，提供多种解决方案

echo "方案选择："
echo "1. 在群晖 NAS 上构建（推荐）"
echo "2. 创建预构建脚本"
echo "3. 使用在线镜像源"

read -p "请选择方案 (1-3): " choice

case $choice in
    1)
        echo "📋 请在群晖 NAS 上执行以下步骤："
        echo ""
        echo "1. SSH 连接到群晖："
        echo "   ssh admin@你的NAS_IP"
        echo ""
        echo "2. 进入项目目录："
        echo "   cd /volume1/docker/nas管应用管理平台/"
        echo ""
        echo "3. 运行构建脚本："
        echo "   chmod +x 快速构建脚本.sh"
        echo "   ./快速构建脚本.sh"
        echo ""
        echo "4. 构建完成后会生成 nas-dashboard.tar 文件"
        echo "5. 在 Container Manager 中导入该文件"
        ;;
    2)
        echo "📦 创建预构建脚本..."
        cat > build-on-nas.sh << 'EOF'
#!/bin/bash
echo "🔨 NAS 上的 Docker 镜像构建"

# 检查网络连通性
echo "🔍 检查网络连接..."
if ping -c 3 registry-1.docker.io >/dev/null 2>&1; then
    echo "✅ 网络正常，使用标准构建"
    DOCKERFILE="Dockerfile"
else
    echo "⚠️  网络不佳，使用本地构建"
    DOCKERFILE="Dockerfile.local"
fi

# 构建镜像
echo "🚀 开始构建..."
docker build -f $DOCKERFILE -t nas-dashboard:latest .

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    
    # 导出镜像
    echo "📦 导出镜像..."
    docker save -o nas-dashboard.tar nas-dashboard:latest
    
    if [ $? -eq 0 ]; then
        echo "🎉 镜像导出成功！"
        echo "文件: $(pwd)/nas-dashboard.tar"
        echo "大小: $(ls -lh nas-dashboard.tar | awk '{print $5}')"
        echo ""
        echo "📋 下一步："
        echo "1. Container Manager → 映像 → 新增 → 从文件新增"
        echo "2. 选择 nas-dashboard.tar 文件"
        echo "3. 导入完成后点击启动"
    else
        echo "❌ 镜像导出失败"
    fi
else
    echo "❌ 构建失败"
    echo "💡 请检查："
    echo "1. Docker 服务是否正常"
    echo "2. 磁盘空间是否充足"
    echo "3. 网络连接是否稳定"
fi
EOF
        chmod +x build-on-nas.sh
        echo "✅ 已创建 build-on-nas.sh 脚本"
        echo "📤 请将此脚本上传到群晖 NAS 并运行"
        ;;
    3)
        echo "🌐 使用在线镜像源..."
        echo "由于当前网络问题，建议在群晖 NAS 上构建"
        echo "群晖的网络环境通常更稳定"
        ;;
esac

echo ""
echo "💡 推荐流程："
echo "1. 上传完整项目到群晖 NAS"
echo "2. 在 NAS 上运行构建脚本"
echo "3. 使用生成的 tar 文件在 Container Manager 中导入"