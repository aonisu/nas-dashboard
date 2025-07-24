#!/bin/bash

# Docker 镜像构建和导出脚本
echo "🚀 构建 NAS Dashboard Docker 镜像..."

# 检查 Docker 是否可用
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    exit 1
fi

# 清理之前的镜像（可选）
echo "🧹 清理旧镜像..."
docker rmi nas-dashboard:latest 2>/dev/null || true

# 构建镜像
echo "🔨 开始构建镜像..."
docker build -t nas-dashboard:latest .

if [ $? -ne 0 ]; then
    echo "❌ 镜像构建失败"
    exit 1
fi

echo "✅ 镜像构建完成"

# 导出镜像为 tar 文件
echo "📦 导出镜像文件..."
docker save -o nas-dashboard.tar nas-dashboard:latest

if [ $? -eq 0 ]; then
    echo "✅ 镜像导出成功!"
    echo ""
    echo "📋 文件信息:"
    ls -lh nas-dashboard.tar
    echo ""
    echo "📤 请将 nas-dashboard.tar 文件上传到群晖 NAS"
    echo "📍 上传路径建议: /volume1/docker/"
    echo ""
    echo "🎯 下一步操作:"
    echo "   1. 上传 nas-dashboard.tar 到群晖 NAS"
    echo "   2. Container Manager → 映像 → 新增 → 从文件新增"
    echo "   3. 选择上传的 tar 文件导入"
    echo "   4. 导入完成后点击运行按钮"
else
    echo "❌ 镜像导出失败"
    exit 1
fi