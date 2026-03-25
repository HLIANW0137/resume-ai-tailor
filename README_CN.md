# 📄 AI 简历构建器 (AI Resume Builder)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)


[简体中文](./README_CN.md) | [English](./README.md)

一款智能全栈 Web 应用，可借助 AI 帮你快速构建、解析并优化简历，能针对目标岗位 JD 定制化调整简历内容，最终导出高质量的单页 PDF 简历。

---

## ✨ 功能特性

- 🤖 **AI 智能简历解析**：粘贴你的原始简历文本（或领英导出内容），AI 会自动将其整理为清晰专业的标准格式。

- 🎯 **JD 智能匹配优化**：粘贴目标岗位描述，AI 会基于 STAR 法则（情境、任务、行动、结果）为你的工作 / 项目经历提供优化建议，完美匹配目标岗位。

- 🔌 **自有密钥（BYOK）隐私优先**：隐私优先设计，无内置 API 密钥，用户可自行提供 Google Gemini API 密钥，或配置任意兼容 OpenAI 的自定义接口。

- 📄 **高质量 PDF 导出**：基于 `html-to-image` 与 `jsPDF` 生成无缝高清单页 PDF，无尴尬分页、无内容截断问题。

- 💾 **JSON 导入 / 导出**：可将结构化的简历数据导出为 JSON 文件备份，后续可导入继续编辑。

- 🎨 **现代化 UI**：基于 React、Tailwind CSS v4 与 shadcn/ui 构建，界面美观、响应式适配、支持无障碍访问。

---

## 🛠️ 技术栈

- **前端**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons

- **UI 组件**: Radix UI / shadcn/ui

- **后端 (API 代理)**: Express.js（处理自定义 API 端点代理，解决跨域问题）

- **AI 集成**: `@google/genai` SDK

- **导出工具**: `html-to-image`, `jspdf`

---

## 🚀 快速开始

### 前置要求

- Node.js（推荐 v18 及以上版本）

- npm 或 yarn

### 安装步骤

1. **克隆仓库:**

    ```bash
    
    git clone https://github.com/yourusername/ai-resume-builder.git
    cd ai-resume-builder
    ```

2. **安装依赖:**

    ```bash
    
    npm install
    ```

3. **启动开发服务:**

    ```bash
    
    npm run dev
    ```

4. **打开浏览器:**
访问 [http://localhost:3000](http://localhost:3000) 即可使用。

---

## 📖 使用说明

1. **配置 API 密钥:**

    - 点击右上角的设置图标 (⚙️)

    - 输入你的 Gemini API 密钥

    - （可选）如果你想使用自定义的兼容 OpenAI 的 API（如 DeepSeek、代理版 Claude 等），输入对应的 Base URL 和 API 密钥即可。

2. **解析简历:**

    - 切换到「解析」标签页

    - 粘贴你的原始简历文本，点击「解析简历」，AI 会自动填充到编辑器中。

3. **岗位优化:**

    - 切换到「优化」标签页

    - 粘贴你要申请的目标岗位描述 (JD)

    - 点击「优化简历」，查看 AI 给出的修改建议，点击「接受」即可将修改应用到你的简历中。

4. **导出:**

    - 点击「导出」->「导出为 PDF」即可下载你的高质量简历

    - 点击「导出」->「导出 JSON」即可将数据本地备份。

---

## 🔧 自定义与调整

本项目设计为高度可定制，你可以根据需求调整：

### 1. 调整 AI 提示词

如果你想修改 AI 解析文本或优化简历的逻辑，可以修改 `src/services/ai.ts` 中的提示词。

- **解析提示词**: 找到 `parseResume` 函数，你可以为 JSON schema 新增字段，或修改指令。

- **优化提示词**: 找到 `optimizeResume` 函数，你可以调整语气、语言，或修改方法论（比如把 STAR 法则改成 XYZ 法则）。

### 2. 修改简历主题 / 样式

简历预览页使用 Tailwind CSS 进行样式开发。

- 要修改生成简历的颜色、字体或间距，编辑 ResumePreview 组件（通常位于 `src/App.tsx` 或 `src/components/ResumePreview.tsx`）。

- 全局样式和 Tailwind 变量可以在 `src/index.css` 中调整。

### 3. 调整 PDF 导出设置

PDF 导出使用 `html-to-image` 来捕获 DOM。如果你需要调整分辨率或背景色，可以在 `src/App.tsx` 中找到 `handlePrint` 函数：

```javascript

const dataUrl = await toPng(resumeRef.current, { 
  quality: 1.0, 
  pixelRatio: 2, // 调大可以提升分辨率，调小可以减小文件体积
  backgroundColor: '#ffffff',
  width: widthPx,
  height: heightPx
});
```

### 4. 新增简历模块

要新增一个简历模块（比如「证书」）：

1. 在 `src/types.ts` 中更新 `ResumeData` 接口

2. 在 `src/services/ai.ts` 的 `parseResume` 函数中更新 JSON schema

3. 在 `src/App.tsx` 中，为编辑器部分添加对应的 UI 输入，同时在预览部分添加展示逻辑。

---

## 🤝 贡献指南

欢迎提交贡献、Issue 和功能请求！可以查看 Issues 页面了解更多。

1. Fork 本项目

2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)

3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)

4. 推送到分支 (`git push origin feature/AmazingFeature`)

5. 打开 Pull Request

---

## 📝 许可证

本项目基于 MIT 许可证开源，详情请查看 LICENSE 文件。
