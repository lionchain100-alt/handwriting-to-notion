# MVP WBS 拆解文档

## 1. 文档概述
本文档基于 `prd-mvp.md` 对 `handwriting-to-notion` MVP 阶段进行 WBS（Work Breakdown Structure）拆解，用于明确实现顺序、模块边界和交付范围。拆解过程遵循 `CLAW.md` 约束，优先按 `types → services → API → UI` 的顺序推进。

## 2. 背景与目标

### 2.1 背景
MVP 的目标不是一次性做到最强识别效果，而是以最低成本验证“手写笔记 → Notion-ready 输出”这一产品价值是否成立。

### 2.2 目标
- 将 MVP 范围拆成可执行的工作包
- 明确开发顺序和模块依赖
- 保证工程实现符合 `CLAW.md`
- 为后续开发任务单和 Sprint 执行提供基础

## 3. 范围

### 3.1 本文档覆盖范围
- 项目准备
- 类型层设计
- Service 层设计
- API 层实现
- UI 层实现
- 联调与验收

## 4. 非范围
- 不覆盖阶段 2 和阶段 3 的功能开发
- 不覆盖详细排期和人员分配
- 不替代具体任务单和 Sprint Backlog

## 5. 用户流程
```text
进入页面
→ 上传手写图片
→ 图像预处理
→ OCR 提取原文
→ 结构化整理输出
→ 用户查看三类结果
→ 用户复制到 Notion
```

## 6. 工作分解结构

### 6.1 项目准备
- 检查并补齐项目目录结构
- 校验基础配置（TS / Tailwind / 路径别名 / 页面入口）
- 补齐 MVP 必要模块目录

### 6.2 Type 层设计
- 定义上传相关类型
- 定义 OCR 原始结果类型
- 定义结构化输出类型
- 定义 provider 接口
- 定义 API 请求响应类型

### 6.3 Service 层实现
- 图片校验服务
- 图片预览辅助服务
- 图像预处理服务
- Tesseract OCR provider
- OCR mock provider
- 结构化输出服务
- mock 结构化逻辑
- 输出格式转换逻辑
- 统一错误映射逻辑

### 6.4 API 层实现
- `POST /api/handwriting/parse`
- `POST /api/handwriting/format`
- API 错误处理统一化
- parse / format 接口联调支持

### 6.5 UI 层实现
- 页面主骨架
- 上传组件
- 状态组件
- 输出组件
- 复制按钮
- 错误与空状态

### 6.6 联调与验收
- 打通上传 → parse API
- 打通 parse → format API
- 打通结果展示与复制
- 验证错误链路
- 边界条件测试
- 主流程体验测试
- 代码约束自查

## 7. 技术方案

### 7.1 实现顺序
严格按以下顺序推进：
1. types
2. services
3. API
4. UI
5. integration
6. QA

### 7.2 MVP 技术基线
- 图像预处理：`sharp`
- OCR baseline：`Tesseract.js`
- 结构化输出：`LLM`（MVP 可先以 mock 逻辑联调）
- 承接流程：Next.js API Route

### 7.3 工程约束
- 严格 TypeScript
- 不用 `any`
- 功能代码放 `/features`
- API 放 `/app/api`
- 公共逻辑放 `/lib`
- 不改无关文件，不引入不必要依赖

## 8. 验收标准
- WBS 覆盖 MVP 主流程全部必要工作包
- 工作项顺序符合 `CLAW.md`
- 模块边界清晰，依赖关系明确
- 可直接用于继续拆分为任务单和 Sprint Backlog

## 9. 风险与依赖

### 9.1 风险
- 拆解粒度过粗，导致执行阶段仍然不清晰
- 在未完成类型层前提前进入 UI，导致返工
- 真实 OCR 与 mock 逻辑切换时接口不一致

### 9.2 应对策略
- 坚持先 types 再 services
- 提前统一 provider 接口和 API 类型
- 用 mock provider 先打通流程，再替换真实 OCR

### 9.3 依赖
- `prd-mvp.md`
- `CLAW.md`
- `Discussion.md` 和 `solution.md` 中的阶段性技术结论

## 10. WBS 清单

### 10.1 项目准备
- [ ] 检查并补齐目录结构
- [ ] 校验基础配置

### 10.2 Type 层
- [ ] 定义上传状态类型
- [ ] 定义上传输入类型
- [ ] 定义 OCR 原始结果类型
- [ ] 定义输出模式与结果类型
- [ ] 定义 provider 接口
- [ ] 定义 API 请求响应类型

### 10.3 Service 层
- [ ] 实现图片校验逻辑
- [ ] 实现图片预览辅助逻辑
- [ ] 实现基础预处理服务
- [ ] 实现 Tesseract OCR provider
- [ ] 实现 OCR mock provider
- [ ] 实现基础结构化结果生成
- [ ] 实现 mock 结构化逻辑
- [ ] 实现复制格式转换逻辑
- [ ] 实现统一错误映射

### 10.4 API 层
- [ ] 创建 parse route
- [ ] 接入图片校验与预处理
- [ ] 接入 OCR provider
- [ ] 创建 format route
- [ ] 接入结构化 service
- [ ] 统一 API 错误响应

### 10.5 UI 层
- [ ] 完善页面主骨架
- [ ] 实现上传组件
- [ ] 实现处理状态组件
- [ ] 实现结果展示组件
- [ ] 实现复制按钮与反馈
- [ ] 实现错误与空状态

### 10.6 联调与验收
- [ ] 打通上传 → parse API
- [ ] 打通 parse → format API
- [ ] 打通结果展示与复制
- [ ] 验证错误链路
- [ ] 完成边界条件测试
- [ ] 完成主流程体验测试
- [ ] 完成代码约束自查
