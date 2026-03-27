# 完整落地方案

## 1. 文档概述
本文档用于沉淀 `handwriting-to-notion` 项目的完整落地方案，统一产品目标、技术路线、工程约束和分阶段实施策略。本文档是后续需求拆解、架构设计和开发排期的总依据。

## 2. 背景与目标

### 2.1 项目背景
`handwriting-to-notion` 不是一个通用 OCR 项目，而是一个垂直场景工具。它面向“手写笔记整理”这一明确需求，核心价值不是单纯识别文字，而是把手写内容变成结构清晰、适合直接进入 Notion 的结果。

### 2.2 项目目标
- 把手写笔记图片转换成可直接用于 Notion 的结构化内容
- 降低手动录入和整理笔记的时间成本
- 优先验证用户是否认可“手写内容 → Notion-ready 输出”的价值
- 在验证需求后，通过可替换的技术方案逐步提升识别效果和产品体验

### 2.3 成功标准
- 用户能完成从上传图片到复制结果的完整流程
- 用户愿意使用结构化输出而不是仅查看原文
- 用户愿意把结果复制到 Notion 或直接导出到 Notion
- 系统架构支持从低成本方案平滑升级到效果优先和完整版方案

## 3. 范围

### 3.1 产品范围
- 识别手写笔记图片
- 输出纯文本、结构化笔记、待办清单
- 支持复制为 Markdown / bullet list / checklist
- 后续支持多图合并、场景模式、Notion 直连导出

### 3.2 技术范围
- 图像预处理
- OCR 原文提取
- LLM / 规则进行结构化整理
- Notion-ready 格式化输出
- 通过 provider 抽象支持后续替换 OCR 引擎和增强结构化能力

## 4. 非范围
- 不做通用 OCR 工具站
- 不做简单的“上传图片 → 返回原始文本”工具
- 不在第一阶段追求字符级最高准确率
- 不在早期阶段做复杂账号系统、团队协作、重型编辑器
- 不在第一阶段做深度版面分析和大而全的文档理解能力

## 5. 用户流程

### 5.1 核心用户流程
```text
进入页面
→ 上传手写图片
→ 系统进行图像预处理
→ OCR 提取原始文本
→ LLM / 规则整理为结构化结果
→ 展示三种输出
   - 纯文本
   - 结构化笔记
   - 待办清单
→ 用户复制到 Notion
→ 后续阶段支持直接导出到 Notion
```

### 5.2 关键交互节点
- 图片上传与预览
- 处理状态反馈（上传中 / 识别中 / 整理中 / 成功 / 失败）
- 结果切换查看
- 一键复制
- warning / 低置信度提示

## 6. 功能需求

### 6.1 上传与输入处理
- 支持上传手写图片
- 支持图片预览
- 后续支持前端旋转和简单裁剪
- 支持基本输入校验和错误提示

### 6.2 手写识别
- 对上传图片进行预处理
- 提取尽量忠实的 OCR 原文
- 返回必要的中间信息，如置信度、行级信息（视 provider 能力而定）

### 6.3 结构化输出
- 输出纯文本
- 输出结构化笔记
- 输出待办清单
- 结构化结果优先面向 Notion 使用场景

### 6.4 结果使用
- 支持复制为 Markdown
- 支持复制为 bullet list
- 支持复制为 checklist
- 后续支持直接导出到 Notion

### 6.5 异常与提示
- 对差图输入提供 warning
- 对低置信度内容提供提示
- 对失败流程提供可理解的报错信息

## 7. 技术方案

### 7.1 技术原则
- 这不是纯 OCR 项目，而是 OCR + 结构化整理项目
- OCR 负责提取，LLM 负责重组，输出负责做到 Notion-ready
- 必须从第一天开始做 provider 抽象，避免后续升级时推翻重写

### 7.2 工程约束（对齐 CLAW.md）
- 技术栈：Next.js（App Router）、TypeScript、Tailwind CSS、Prisma
- 所有功能放在 `/features`
- API 路由放在 `/app/api`
- 公共逻辑放在 `/lib`
- 开发顺序：types → service logic → API route → UI
- 严格 TypeScript，不使用 `any`
- 使用函数式组件和 async/await
- 不改无关文件，不引入不必要依赖

### 7.3 推荐目录结构
```text
handwriting-to-notion/
├── app/
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── handwriting/parse/route.ts
│   │   ├── handwriting/format/route.ts
│   │   └── notion/export/route.ts
│   ├── handwriting-to-notion/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── features/
│   ├── upload/
│   ├── handwriting/
│   ├── output/
│   └── notion/
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── env.ts
├── prisma/
│   └── schema.prisma
```

### 7.4 核心数据结构
```ts
type UploadRequest = {
  image: File;
  mode?: 'plain-text' | 'structured-notes' | 'todo-list' | 'all';
  scene?: 'general' | 'class-notes' | 'meeting-notes' | 'sticky-notes' | 'whiteboard';
};

type OcrRawResult = {
  text: string;
  confidence?: number;
  lines?: Array<{
    text: string;
    confidence?: number;
    bbox?: { x: number; y: number; width: number; height: number };
  }>;
};

type HandwritingResult = {
  plainText: string;
  structuredNotes: string;
  todoList: string;
  warnings?: string[];
};
```

### 7.5 Provider 抽象
```ts
type PreprocessProvider = {
  process(input: Buffer): Promise<Buffer>;
};

type OcrProvider = {
  extract(input: Buffer): Promise<OcrRawResult>;
};

type RestructureProvider = {
  transform(input: OcrRawResult, scene?: string): Promise<HandwritingResult>;
};
```

### 7.6 API 设计
- `POST /api/handwriting/parse`：负责接收图片、预处理、OCR 提取
- `POST /api/handwriting/format`：负责结构化整理并输出三类结果
- `POST /api/notion/export`：后续负责导出到 Notion

### 7.7 分阶段技术路线
#### 阶段 1：MVP
- sharp 预处理
- Tesseract.js OCR
- LLM 结构化整理

#### 阶段 2：效果优先
- sharp 预处理
- 云 OCR / Document AI
- LLM 结构化整理

#### 阶段 3：完整版
- OCR 保底提取
- 多模态模型增强结构理解
- Notion API 直连
- 多图合并、编辑修正、场景模板

## 8. 验收标准
- 有清晰的产品目标和边界定义
- 工程结构与 `CLAW.md` 约束一致
- 三阶段路线清晰，升级条件明确
- 核心模块、数据结构、API 设计可直接支撑开发
- 文档能够作为后续 PRD 和开发实施的统一依据

## 9. 风险与依赖

### 9.1 主要风险
- 做成泛 OCR 工具，失去差异化
- OCR 质量不稳定影响用户体验
- LLM 幻觉导致结果不可信
- 输入图片质量差导致识别失败率高
- 技术路线没有抽象，后续升级成本过高

### 9.2 应对策略
- 所有文案和功能都围绕 handwriting + Notion 场景
- 保留 plain text 作为原文兜底
- 对结构化结果加强 prompt 约束
- 增加 warning 和低置信度提示
- 从第一版开始实现 provider 抽象

### 9.3 外部依赖
- OCR 引擎（Tesseract.js / Cloud OCR）
- LLM 结构化能力
- 后续 Notion API
