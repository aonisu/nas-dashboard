# 🚀 发布到 Docker Hub - 最先进的部署方案

## 🎯 方案概述

通过 GitHub Actions 自动构建并发布到 Docker Hub，用户可以直接从官方镜像仓库安装，无需本地构建！

## 📋 设置步骤

### 步骤 1: 创建 Docker Hub 账号

1. **注册 Docker Hub**
   - 访问 https://hub.docker.com/
   - 创建免费账号
   - 记录用户名（例如：`aonisu`）

### 步骤 2: 创建 GitHub 仓库

1. **上传项目到 GitHub**
   ```bash
   # 在项目目录下
   git init
   git add .
   git commit -m "Initial commit: NAS Dashboard"
   git remote add origin https://github.com/aonisu/nas-dashboard.git
   git push -u origin main
   ```

### 步骤 3: 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. **Settings** → **Secrets and variables** → **Actions**
2. 添加以下 Secrets：
   ```
   DOCKER_USERNAME: 您的Docker Hub用户名
   DOCKER_PASSWORD: 您的Docker Hub密码或Token
   ```

### 步骤 4: 自动构建

一旦推送代码到 GitHub，将自动：
- ✅ 构建 Docker 镜像
- ✅ 推送到 Docker Hub
- ✅ 支持多架构（AMD64, ARM64）
- ✅ 自动打标签（latest, version）

## 🎯 用户安装体验

### 方式一：Container Manager 直接拉取

1. **打开 Container Manager**
   - DSM → Container Manager

2. **注册表搜索**
   - 点击 "注册表" 标签页
   - 搜索：`aonisu/nas-dashboard`
   - 点击 "下载" → 选择 `latest` 标签

3. **启动容器**
   - 下载完成后在 "映像" 中找到镜像
   - 点击 "启动" 按钮配置容器

### 方式二：Docker Compose 一键部署

1. **创建部署文件**
   ```bash
   # 在群晖上创建目录
   mkdir -p /volume1/docker/nas-dashboard
   cd /volume1/docker/nas-dashboard
   ```

2. **下载 Compose 文件**
   ```bash
   # 下载官方 compose 文件
   wget https://raw.githubusercontent.com/aonisu/nas-dashboard/main/docker-compose.hub.yml
   mv docker-compose.hub.yml docker-compose.yml
   ```

3. **一键启动**
   ```bash
   docker-compose up -d
   ```

### 方式三：直接 Docker 命令

```bash
# 创建数据目录
mkdir -p /volume1/docker/nas-dashboard/data

# 启动容器
docker run -d \
  --name nas-dashboard \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /volume1/docker/nas-dashboard/data:/app/data \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_PATH=/app/data/database.sqlite \
  -e TZ=Asia/Shanghai \
  aonisu/nas-dashboard:latest
```

## 🌟 Docker Hub 发布的优势

### ✅ 用户体验优势
- **一键安装** - 无需构建，直接下载使用
- **自动更新** - 支持版本管理和自动更新
- **多架构支持** - 支持 x86、ARM 等不同架构
- **官方镜像** - 提供可信的官方镜像源

### ✅ 维护优势
- **自动构建** - 代码更新自动构建新镜像
- **版本管理** - 支持语义化版本标签
- **质量保证** - GitHub Actions 自动化测试
- **全球分发** - Docker Hub CDN 全球加速

## 📊 多种安装方式对比

| 方式 | 复杂度 | 用户体验 | 推荐度 |
|------|--------|----------|--------|
| **Docker Hub 镜像** | ⭐ 极简 | ⭐⭐⭐⭐⭐ 优秀 | 🏆 强烈推荐 |
| 本地构建 tar | ⭐⭐⭐ 复杂 | ⭐⭐ 一般 | ⚠️ 备用方案 |
| GitHub 源码 | ⭐⭐ 中等 | ⭐⭐⭐ 良好 | ✅ 推荐 |

## 🔄 版本更新流程

### 发布新版本
```bash
# 打标签发布
git tag v1.0.0
git push origin v1.0.0

# 自动构建并发布到 Docker Hub
# 用户可选择版本：latest, v1.0.0, 1.0, 1
```

### 用户更新
```bash
# 拉取最新镜像
docker pull aonisu/nas-dashboard:latest

# 重启容器
docker-compose down && docker-compose up -d
```

## 📋 用户安装文档模板

为用户提供的简化安装文档：

```markdown
# NAS Dashboard 安装指南

## 🚀 一键安装（推荐）

### Container Manager 安装
1. Container Manager → 注册表 → 搜索 "aonisu/nas-dashboard"
2. 下载 latest 标签
3. 启动容器配置：
   - 端口：3000:3000
   - 存储：/volume1/docker/nas-dashboard/data → /app/data
   - 环境变量：NODE_ENV=production

### Docker 命令安装
```bash
mkdir -p /volume1/docker/nas-dashboard/data
docker run -d --name nas-dashboard -p 3000:3000 \
  -v /volume1/docker/nas-dashboard/data:/app/data \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  aonisu/nas-dashboard:latest
```

访问：http://你的NAS_IP:3000
```

## 🎉 总结

**Docker Hub 方案的优势：**
- 🎯 **极简安装** - 用户无需构建，直接使用
- 🔄 **自动更新** - 代码推送自动构建发布
- 🌐 **全球可用** - Docker Hub 全球 CDN 加速
- 📱 **多架构** - 支持各种 NAS 设备
- 🛡️ **可信源** - 官方维护的镜像仓库

这是最现代化、最用户友好的分发方式！需要我帮您设置 GitHub 仓库和 Docker Hub 自动发布吗？