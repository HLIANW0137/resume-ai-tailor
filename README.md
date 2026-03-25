# 📄 AI Resume Builder

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)

简体中文 | English

An intelligent, full-stack web application that helps you build, parse, and optimize your resume using AI. Tailor your resume to specific Job Descriptions (JD) and export it as a high-quality, single-page PDF.

## ✨ Features

- 🤖 **AI-Powered Parsing**: Paste your raw resume text (or LinkedIn export) and let AI automatically structure it into a clean, professional format.
- 🎯 **Smart JD Optimization**: Paste a Job Description, and the AI will suggest STAR-method (Situation, Task, Action, Result) optimizations for your work and project experiences to perfectly match the role.
- 🔌 **Bring Your Own Key (BYOK)**: Privacy-first design. No built-in API keys. Users provide their own Google Gemini API key or configure any custom OpenAI-compatible endpoint.
- 📄 **High-Quality PDF Export**: Generates a seamless, high-resolution, single-page PDF using `html-to-image` and `jsPDF`—no awkward page breaks or cut-off text.
- 💾 **JSON Import/Export**: Export your structured resume data as a JSON file for safe keeping, and import it later to continue editing.
- 🎨 **Modern UI**: Built with React, Tailwind CSS v4, and shadcn/ui for a beautiful, responsive, and accessible user experience.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons
- **UI Components**: Radix UI / shadcn/ui
- **Backend (API Proxy)**: Express.js (handles custom API endpoint proxying to avoid CORS issues)
- **AI Integration**: `@google/genai` SDK
- **Exporting**: `html-to-image`, `jspdf`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-resume-builder.git
   cd ai-resume-builder
