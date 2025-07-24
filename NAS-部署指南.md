# 群晖 NAS 部署指南

## 📋 部署前准备

### 1. 系统要求
- 群晖 NAS (DSM 7.0+)
- Docker 套件已安装
- SSH 访问权限 (推荐) 或 Container Manager

### 2. 硬件要求
- RAM: 最少 1GB 可用内存
- 存储: 约 100MB 磁盘空间
- CPU: 任何现代 ARM64/x64 处理器

## 🚀 方法一：SSH 命令行部署（推荐）

### 步骤 1: 上传项目文件

1. 将整个项目文件夹上传到 NAS，建议路径：
   ```
   /volume1/docker/nas-dashboard/
   ```

2. 通过 SSH 连接到 NAS：
   ```bash
   ssh admin@你的NAS_IP地址
   ```

3. 进入项目目录：
   ```bash
   cd /volume1/docker/nas-dashboard/
   ```

### 步骤 2: 运行部署脚本

```bash
# 给脚本执行权限
chmod +x deploy-to-nas.sh

# 运行部署
./deploy-to-nas.sh
```

### 步骤 3: 访问应用

部署成功后，通过以下地址访问：
- **内网访问**: `http://你的NAS_IP:3000`
- **本地访问**: `http://localhost:3000` (在 NAS 上)

## 🖥️ 方法二：Container Manager 图形界面部署

### 步骤 1: 打开 Container Manager

1. 登录 DSM
2. 打开 "Container Manager" 套件
3. 选择 "项目" 标签页

### 步骤 2: 创建新项目

1. 点击 "新增"
2. 选择 "从文件夹创建"
3. 选择上传的项目文件夹
4. 设置项目名称: `nas-dashboard`

### 步骤 3: 配置设置

1. **端口映射**: 
   - 容器端口: 3000
   - 本地端口: 3000 (可自定义)

2. **存储映射**:
   - 容器路径: `/app/data`
   - 本地路径: `/volume1/docker/nas-dashboard/data`

3. **Docker Socket**:
   - 容器路径: `/var/run/docker.sock`
   - 本地路径: `/var/run/docker.sock`
   - 权限: 只读

### 步骤 4: 启动容器

1. 点击 "下一步" → "完成"
2. 等待镜像构建和容器启动
3. 在项目列表中确认状态为 "正在运行"

## 🔧 配置说明

### 环境变量
```bash
NODE_ENV=production          # 生产环境
PORT=3000                   # 服务端口
DB_PATH=/app/data/database.sqlite  # 数据库路径
TZ=Asia/Shanghai           # 时区设置
```

### 数据持久化
- 数据库文件: `./data/database.sqlite`
- 系统配置: `./data/settings.json`
- 历史统计: `./data/stats.db`

## 🛡️ 安全配置

### 1. 网络安全
```yaml
# 仅内网访问（推荐）
ports:
  - "127.0.0.1:3000:3000"  # 只允许本机访问
  # 或
  - "192.168.0.0/16:3000:3000"  # 只允许内网访问
```

### 2. Docker Socket 权限
默认配置已设置为只读模式，确保安全性。

### 3. 防火墙设置
在 DSM 控制面板中：
1. 安全性 → 防火墙
2. 添加规则允许端口 3000
3. 设置来源 IP 范围（建议仅内网）

## 📊 功能说明

### 主要功能
- 🎯 **仪表板**: 系统资源监控
- 🔗 **链接管理**: Docker 服务快速访问
- 💻 **系统信息**: 硬件状态监控
- 🐳 **Docker 管理**: 容器启停控制
- ⚙️ **设置**: 主题和配置选项

### 监控内容
- CPU 使用率
- 内存使用情况
- 磁盘空间状态
- 网络接口信息
- Docker 容器状态

## 🔄 维护操作

### 查看日志
```bash
cd /volume1/docker/nas-dashboard/
docker-compose logs -f
```

### 重启服务
```bash
docker-compose restart
```

### 更新应用
```bash
git pull  # 如果使用 Git
./deploy-to-nas.sh
```

### 备份数据
```bash
# 备份数据目录
tar -czf nas-dashboard-backup-$(date +%Y%m%d).tar.gz ./data/
```

### 完全清理
```bash
docker-compose down
docker rmi nas-dashboard_nas-dashboard
rm -rf ./data/  # 注意：这会删除所有数据
```

## 🆘 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 检查日志
   docker-compose logs
   
   # 检查端口占用
   netstat -tlnp | grep 3000
   ```

2. **Docker Socket 权限问题**
   ```bash
   # 检查 Docker Socket 权限
   ls -l /var/run/docker.sock
   
   # 确保用户在 docker 组中
   groups $USER
   ```

3. **数据库锁定问题**
   ```bash
   # 重启容器
   docker-compose restart
   ```

4. **内存不足**
   ```bash
   # 检查系统资源
   free -h
   df -h
   ```

### 联系支持
如遇到问题，请检查：
1. DSM 版本是否支持
2. Docker 套件是否正常运行
3. 系统资源是否充足
4. 网络连接是否正常

## 📞 技术支持

- 项目地址: [GitHub 仓库]
- 问题反馈: [Issues 页面]
- 文档: [项目 Wiki]

---

🎉 **享受您的 NAS 管理体验！**