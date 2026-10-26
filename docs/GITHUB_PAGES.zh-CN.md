# 手机个人版（GitHub Pages）

本仓库基于 DuarteSantos8/openGym，保留 AGPL 许可证和运动素材的原始授权说明。

个人版使用 `VITE_PERSONAL=1`，首次打开为空白记录、默认中文。训练计划、训练历史、体重和自定义设置保存在当前浏览器；没有演示记录、账号登录、服务器同步或 AI 教练。普通服务器构建和未来 Capacitor App 构建仍可使用原有后端。

## 构建与发布

需要 Node.js 22：

```sh
npm --prefix frontend ci --ignore-scripts
node scripts/pages/build.mjs
```

产物是 `frontend/dist-pages`，包含前端、PWA 文件及原始 180px 动作素材，不包含后端数据、备份、环境变量或凭据。相对资源地址和 HashRouter 支持 `/openGym/` 子路径。

仓库 Settings → Pages → Source 选择 GitHub Actions。启用仓库 Actions 后，向 main 提交相关文件会自动测试、构建并发布；也可以在 Actions 中手动运行 Deploy personal openGym to GitHub Pages。

预期站点地址：https://lf419.github.io/openGym/ 。以 Actions 发布成功和实际访问结果为准。

## 手机使用与备份

- iPhone 用 Safari 打开，分享 → 添加到主屏幕；Android 用 Chrome 的添加到主屏幕。
- 设置 → 数据与备份 → 导出备份（JSON）。有自定义图片或视频时选择包含媒体的 ZIP 备份，保存到手机文件或自己的云盘。
- 在新设备或新浏览器用“导入备份”恢复。不同设备、浏览器以及主屏幕 App 的存储可能独立，不能当作自动同步。
- 清理网站数据、无痕浏览、系统回收存储或卸载主屏幕 App 可能导致本地记录丢失。每周及更换设备前导出备份。
- 网页和代码公开；个人记录保存在设备中，不会随代码部署到 GitHub。请勿将导出的个人备份提交进仓库。

首次加载需要联网，PWA 会缓存应用界面；未缓存的动作图片、视频仍需网络。GitHub Pages 在不同网络下的访问速度可能不同。
