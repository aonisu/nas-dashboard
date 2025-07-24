# Container Manager 图形化部署指南

## 🎯 两种部署方式对比

### 方式一：项目部署（推荐）✨
- ✅ 自动构建镜像
- ✅ 配置简单
- ✅ 支持一键更新
- ✅ 日志管理方便

### 方式二：容器部署
- ⚠️ 需要先构建镜像
- ✅ 配置灵活
- ✅ 资源控制精确

## 🚀 方式一：Container Manager 项目部署

### 步骤 1: 上传项目文件
1. 将整个 `nas管应用管理平台` 文件夹上传到群晖
2. 建议放在 `/volume1/docker/nas-dashboard/`

### 步骤 2: 创建项目
1. **打开 Container Manager**
   - DSM 主菜单 → Container Manager

2. **新建项目**
   - 点击 "项目" 标签页
   - 点击 "新增" 按钮
   - 选择 "从源创建"

3. **配置项目**
   ```
   项目名称: nas-dashboard
   来源: 本地文件夹
   路径: /volume1/docker/nas-dashboard
   ```

4. **启动构建**
   - 点击 "下一步"
   - 系统会自动读取 docker-compose.yml
   - 点击 "完成" 开始构建

### 步骤 3: 等待完成
- 构建过程需要 5-10 分钟
- 可在 "项目" 页面查看状态
- 状态变为 "正在运行" 即可访问

## 🔧 方式二：直接容器部署

### 步骤 1: SSH 构建镜像
```bash
# SSH 连接 NAS
ssh admin@你的NAS_IP

# 进入项目目录
cd /volume1/docker/nas-dashboard

# 运行一键部署脚本
chmod +x synology-deploy.sh
./synology-deploy.sh

# 选择选项 2 (仅构建镜像)
```

### 步骤 2: Container Manager 创建容器

1. **容器页面**
   - Container Manager → 容器 → 新增

2. **选择镜像**
   - 镜像: `nas-dashboard:latest`
   - 容器名称: `nas-dashboard`

3. **高级设置**

   **端口设置:**
   ```
   本地端口: 3000
   容器端口: 3000
   类型: TCP
   ```

   **存储空间:**
   ```
   文件夹: /volume1/docker/nas-dashboard/data
   装载路径: /app/data
   ```
   ```
   文件夹: /var/run/docker.sock
   装载路径: /var/run/docker.sock
   权限: 只读
   ```

   **环境:**
   ```
   NODE_ENV=production
   PORT=3000
   DB_PATH=/app/data/database.sqlite
   TZ=Asia/Shanghai
   ```

4. **启动容器**
   - 点击 "下一步" → "完成"

## 📋 配置清单

### 必需的存储映射
| 本地路径 | 容器路径 | 权限 | 说明 |
|---------|---------|------|------|
| `/volume1/docker/nas-dashboard/data` | `/app/data` | 读写 | 数据库和配置文件 |
| `/var/run/docker.sock` | `/var/run/docker.sock` | 只读 | Docker API 访问 |

### 必需的端口转发
| 本地端口 | 容器端口 | 协议 |
|---------|---------|------|
| 3000 | 3000 | TCP |

### 推荐的环境变量
| 变量名 | 值 | 说明 |
|-------|----|----|
| NODE_ENV | production | 生产环境 |
| PORT | 3000 | 服务端口 |
| DB_PATH | /app/data/database.sqlite | 数据库路径 |
| TZ | Asia/Shanghai | 时区设置 |

## 🎯 访问和验证

### 访问地址
- **内网**: `http://你的NAS_IP:3000`
- **本机**: `http://localhost:3000`

### 功能验证
1. ✅ 首页仪表板显示系统信息
2. ✅ 系统链接页面可以添加链接
3. ✅ 系统信息页面显示硬件状态
4. ✅ Docker 页面显示容器列表
5. ✅ 设置页面可以切换主题

## 🔍 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查日志
   docker logs nas-dashboard
   ```

2. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tlnp | grep 3000
   ```

3. **权限问题**
   ```bash
   # 检查数据目录权限
   ls -la /volume1/docker/nas-dashboard/data
   ```

4. **Docker Socket 访问失败**
   - 确保映射了 `/var/run/docker.sock`
   - 确保权限设置为只读

### 重新部署
如果需要重新部署：

1. **停止容器/项目**
   - Container Manager 中停止服务

2. **清理数据** (可选)
   ```bash
   rm -rf /volume1/docker/nas-dashboard/data/*
   ```

3. **重新创建**
   - 按照上述步骤重新创建

## 📊 性能优化

### 资源限制建议
- **内存限制**: 512MB - 1GB
- **CPU 限制**: 1-2 核
- **存储**: 预留 100MB+ 空间

### 自动启动
- 启用 "开机自动启动"
- 启用 "退出时自动重启"

---

🎉 **现在您可以通过 Container Manager 图形界面轻松部署 NAS 管理平台了！**