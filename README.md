# NAS 管理平台

一个漂亮、现代化的 NAS Docker 系统管理平台，专为群晖等 NAS 系统设计。

## ✨ 特色功能

- 🎨 **极简美观** - 现代化的界面设计，支持深色/浅色主题
- 🔗 **系统链接管理** - 统一管理所有 Docker 服务的访问链接
- 📊 **实时监控** - 系统资源使用情况实时监控
- 🐳 **Docker 管理** - 可视化管理 Docker 容器
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **实时更新** - WebSocket 实时数据推送
- 🔒 **安全可靠** - 内置安全防护机制

## 🏗️ 技术架构

### 前端
- **React 18** + **TypeScript** - 现代化前端框架
- **Tailwind CSS** - 实用优先的样式框架
- **Framer Motion** - 流畅的动画效果
- **Zustand** - 轻量级状态管理
- **Recharts** - 数据可视化图表

### 后端
- **Node.js** + **Express** - 服务端框架
- **TypeScript** - 类型安全的开发体验
- **SQLite** - 轻量级数据库
- **Dockerode** - Docker API 集成
- **systeminformation** - 系统信息获取
- **WebSocket** - 实时数据推送

## 🚀 快速开始

### 使用 Docker Compose (推荐)

1. 克隆项目
```bash
git clone <repository-url>
cd nas管应用管理平台
```

2. 启动服务
```bash
docker-compose up -d
```

3. 访问应用
打开浏览器访问 `http://localhost:3000`

### 开发环境

1. 安装依赖
```bash
npm run install:all
```

2. 启动开发服务器
```bash
npm run dev
```

## 📁 项目结构

```
nas管应用管理平台/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── pages/         # 页面组件
│   │   ├── store/         # 状态管理
│   │   ├── types/         # TypeScript 类型定义
│   │   └── utils/         # 工具函数
│   └── public/            # 静态资源
├── server/                # 后端服务
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── routes/        # 路由
│   │   ├── models/        # 数据模型
│   │   ├── services/      # 业务服务
│   │   └── utils/         # 工具函数
│   └── dist/              # 编译输出
├── data/                  # 数据目录 (Docker 挂载)
├── docker-compose.yml     # Docker 编排文件
├── Dockerfile            # Docker 镜像构建
└── README.md             # 项目文档
```

## 🔧 环境变量

创建 `.env` 文件或在 docker-compose.yml 中配置：

```env
NODE_ENV=production
PORT=3000
DB_PATH=/app/data/database.sqlite
```

## 📋 功能详情

### 仪表板
- 系统概览卡片
- 快速操作按钮
- 常用系统链接
- 实时性能图表

### 系统链接管理
- 添加/编辑/删除链接
- 按分类筛选
- 状态检查
- 批量操作

### 系统信息
- CPU、内存使用率
- 磁盘空间监控
- 网络接口信息
- 24小时性能图表

### Docker 管理
- 容器列表查看
- 启动/停止/重启容器
- 查看容器日志
- 容器状态监控

### 设置
- 主题切换
- 通知设置
- 系统配置
- 安全选项

## 🔌 API 接口

### 系统信息
- `GET /api/system/info` - 获取系统信息
- `GET /api/system/performance` - 获取性能数据
- `GET /api/system/stats/history` - 获取历史统计

### Docker 管理
- `GET /api/docker/containers` - 获取容器列表
- `POST /api/docker/containers/:id/start` - 启动容器
- `POST /api/docker/containers/:id/stop` - 停止容器
- `GET /api/docker/containers/:id/logs` - 获取容器日志

### 系统链接
- `GET /api/links` - 获取所有链接
- `POST /api/links` - 创建新链接
- `PUT /api/links/:id` - 更新链接
- `DELETE /api/links/:id` - 删除链接

## 🛡️ 安全考虑

- Helmet.js 安全头设置
- CORS 跨域保护
- Docker socket 只读挂载
- SQLite 数据库本地存储
- 输入验证和清理

## 🔄 数据备份

数据存储在 `./data` 目录中，包含：
- SQLite 数据库文件
- 系统配置
- 历史统计数据

定期备份该目录以保护您的数据。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 故障排除

### 常见问题

1. **Docker 连接失败**
   - 确保 Docker socket 正确挂载
   - 检查容器权限设置

2. **系统信息获取失败**
   - 确保容器有足够的系统权限
   - 检查 systeminformation 包依赖

3. **端口冲突**
   - 修改 docker-compose.yml 中的端口映射
   - 确保所选端口未被占用

4. **数据库问题**
   - 检查数据目录权限
   - 确保 SQLite 文件可写

### 日志查看

```bash
# 查看容器日志
docker-compose logs -f nas-dashboard

# 查看实时日志
docker logs -f nas-dashboard
```

## 📞 支持

如果您遇到问题或有建议，请：
- 提交 GitHub Issue
- 查看项目文档
- 联系项目维护者

---

**享受您的 NAS 管理体验！** 🎉