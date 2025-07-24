# 群晖 Container Manager 图形化部署指南

## 🖥️ 方法一：Container Manager 项目部署（推荐）

### 步骤 1: 上传项目文件

1. 将整个项目文件夹上传到群晖 NAS
   - 建议路径：`/volume1/docker/nas-dashboard/`
   - 可通过 File Station 或 SCP 上传

### 步骤 2: 使用 Container Manager

1. **打开 Container Manager**
   - 登录 DSM
   - 打开 "Container Manager" 套件

2. **创建项目**
   - 点击 "项目" 标签页
   - 点击 "新增" 按钮
   - 选择 "从源创建"

3. **配置项目**
   - **项目名称**: `nas-dashboard`
   - **路径**: 选择上传的项目文件夹路径
   - **来源**: 选择 "本地文件夹"

4. **启动构建**
   - 点击 "下一步"
   - Container Manager 会自动读取 `docker-compose.yml`
   - 点击 "完成" 开始构建

## 🖼️ 方法二：直接容器部署

如果您想通过容器界面直接运行，需要先构建镜像：

### 步骤 1: SSH 构建镜像

```bash
# SSH 连接到 NAS
ssh admin@你的NAS_IP

# 进入项目目录
cd /volume1/docker/nas-dashboard/

# 构建镜像
docker build -t nas-dashboard:latest .
```

### 步骤 2: Container Manager 创建容器

1. **打开容器页面**
   - Container Manager → 容器

2. **新增容器**
   - 点击 "新增"
   - 选择 "从镜像创建"

3. **选择镜像**
   - 镜像: `nas-dashboard:latest`
   - 容器名称: `nas-dashboard`

4. **配置设置**
   
   **端口映射**:
   ```
   本地端口: 3000
   容器端口: 3000
   类型: TCP
   ```

   **存储映射**:
   - 文件夹: `/volume1/docker/nas-dashboard/data`
   - 装载路径: `/app/data`
   
   **Docker Socket 映射**:
   - 文件夹: `/var/run/docker.sock`
   - 装载路径: `/var/run/docker.sock`
   - 权限: 只读

   **环境变量**:
   ```
   NODE_ENV=production
   PORT=3000
   DB_PATH=/app/data/database.sqlite
   TZ=Asia/Shanghai
   ```

5. **启动容器**
   - 点击 "下一步" → "完成"
   - 容器将自动启动

## 🚀 方法三：一键部署脚本（最简单）

我创建了一个专门的一键部署脚本：