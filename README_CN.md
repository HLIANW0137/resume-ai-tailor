# 📄 AI 简历构建器 (AI Resume Builder)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)

[English](./README.md) | 简体中文

这是一个智能的全栈 Web 应用程序，利用 AI 技术帮助你构建、解析和优化简历。你可以根据特定的职位描述 (JD) 量身定制简历，并将其导出为高质量的单页 PDF。

---

## ✨ 功能特性

* 🤖 **AI 自动解析**：粘贴你的简历原始文本（或 LinkedIn 导出的内容），让 AI 自动将其转化为整洁、专业的结构化格式。
* 🎯 **智能 JD 优化**：粘贴职位描述 (JD)，AI 将根据 **STAR 法则**（情境、任务、行动、结果）为你的工作和项目经历提供优化建议，使简历与目标岗位完美匹配。
* 🔌 **自带 API 密钥 (BYOK)**：隐私优先设计。项目不内置 API 密钥，用户需提供自己的 Google Gemini API 密钥，或配置任何兼容 OpenAI 标准的自定义接口。
* 📄 **高质量 PDF 导出**：使用 `html-to-image` 和 `jsPDF` 生成流畅、高分辨率的单页 PDF——告别糟糕的分页断行或文字截断。
* 💾 **JSON 导入/导出**：支持将结构化简历数据导出为 JSON 文件进行备份，或随时导入继续编辑。
* 🎨 **现代 UI 设计**：基于 React 19、Tailwind CSS v4 和 shadcn/ui 构建，提供精美、响应式且符合无障碍标准的交互体验。

---

## 🛠️ 技术栈

* **前端**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons
* **UI 组件库**: Radix UI / shadcn/ui
* **后端 (API 代理)**: Express.js (处理自定义 API 端点代理，规避 CORS 跨域问题)
* **AI 集成**: `@google/genai` SDK
* **导出工具**: `html-to-image`, `jspdf`

---

## 🚀 快速上手

### 环境准备

* Node.js (建议 v18 或更高版本)
* npm 或 yarn

### 安装步骤

1.  **克隆仓库**
    ```bash
    git clone [https://github.com/yourusername/ai-resume-builder.git](https://github.com/yourusername/ai-resume-builder.git)
    cd ai-resume-builder
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **启动开发服务器**
    ```bash
    npm run dev
    ```

4.  **配置 API 密钥**
    启动应用后，在设置面板中输入你的 Google Gemini API 密钥或 OpenAI 兼容端点即可开始使用。

---

## 📜 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。
