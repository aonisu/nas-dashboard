# Container Manager 配置模板

## 📋 完整配置清单 - 直接复制使用

### 🏷️ 基本信息
```
容器名称: nas-dashboard
映像: nas-dashboard:latest
启用自动重新启动: ✅
```

### 🔌 端口设置
```
本地端口: 3000
容器端口: 3000  
类型: TCP
```

### 📁 存储空间设置

**装载 1 - 应用数据:**
```
类型: 绑定装载
文件夹: /volume1/docker/nas-dashboard/data
装载路径: /app/data
权限: 读写
```

**装载 2 - Docker Socket:**
```
类型: 绑定装载
文件夹: /var/run/docker.sock
装载路径: /var/run/docker.sock
权限: 只读 ✅
```

### 🌍 环境变量
```
NODE_ENV=production
PORT=3000
DB_PATH=/app/data/database.sqlite
TZ=Asia/Shanghai
```

## 🚀 快速配置步骤

### 1. 导入镜像
- Container Manager → 映像 → 新增 → 从文件新增
- 选择 `nas-dashboard.tar`

### 2. 启动容器
- 找到 `nas-dashboard:latest` 镜像
- 点击 "启动" 按钮

### 3. 配置向导
按照以下顺序配置：

**常规设置:**
- 容器名称: `nas-dashboard`
- ✅ 启用自动重新启动

**端口设置:**
- 添加端口: `3000:3000 TCP`

**存储空间:**
- 添加装载1: `/volume1/docker/nas-dashboard/data` → `/app/data`
- 添加装载2: `/var/run/docker.sock` → `/var/run/docker.sock` (只读)

**环境:**
- 添加4个环境变量 (见上方清单)

### 4. 完成启动
- 点击 "下一步" → "完成"
- 等待容器启动完成

## 🎯 验证部署

访问 `http://你的NAS_IP:3000` 检查：
- ✅ 页面正常加载
- ✅ 仪表板显示系统信息
- ✅ Docker 页面显示容器列表

---

**🎉 标准部署完成！享受您的 NAS 管理平台！**