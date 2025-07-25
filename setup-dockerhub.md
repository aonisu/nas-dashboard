# 🐳 Docker Hub 配置步骤

## 第一步：创建 Docker Hub 账号

1. **注册 Docker Hub**
   - 访问 https://hub.docker.com
   - 点击 "Sign Up" 创建免费账号
   - 记住您的用户名（例如：`yourname`）

2. **创建仓库**
   - 登录后点击 "Create Repository"
   - Repository Name: `nas-dashboard`
   - Description: `🏠 Beautiful NAS management dashboard for Synology and other home servers`
   - Visibility: `Public` (免费账号)
   - 点击 "Create"

## 第二步：获取访问令牌

1. **创建访问令牌**
   - 点击右上角头像 → "Account Settings"
   - 左侧菜单 → "Security"
   - 点击 "New Access Token"
   
2. **令牌配置**
   ```
   Access Token Description: GitHub Actions
   Access permissions: Read, Write, Delete
   ```
   
3. **保存令牌**
   - 点击 "Generate"
   - **重要**: 复制生成的令牌，关闭页面后无法再查看
   - 格式类似：`dckr_pat_1234567890abcdef...`

## 第三步：配置 GitHub Secrets

1. **进入 GitHub 仓库设置**
   - 访问您的 GitHub 仓库
   - 点击 "Settings" 标签页
   - 左侧菜单 → "Secrets and variables" → "Actions"

2. **添加 Docker Hub 凭据**
   
   **Secret 1:**
   ```
   Name: DOCKER_USERNAME
   Secret: 您的Docker Hub用户名（例如：yourname）
   ```
   
   **Secret 2:**
   ```
   Name: DOCKER_PASSWORD
   Secret: 刚才复制的访问令牌（dckr_pat_...）
   ```

3. **点击 "Add secret" 保存**

## 第四步：更新配置文件

需要更新几个文件中的用户名占位符：

### 1. 更新 install.sh
```bash
# 将文件中的 yourname 替换为您的 Docker Hub 用户名
IMAGE_NAME="yourname/nas-dashboard:latest"
```

### 2. 更新 docker-compose.hub.yml
```yaml
# 将文件中的 yourusername 替换为您的 Docker Hub 用户名
image: yourname/nas-dashboard:latest
```

### 3. 更新其他相关文件
- `发布到DockerHub指南.md`
- `先进部署方案.md`
- `GitHub发布指南.md`

将所有 `yourname` 或 `yourusername` 替换为您的实际 Docker Hub 用户名。