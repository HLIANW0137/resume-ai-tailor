# 📄 AI Resume Builder

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)

[简体中文](./README_CN.md) | [English](./README.md)

# AI Resume Builder README.md

An intelligent, full-stack web application that helps you build, parse, and optimize your resume using AI. Tailor your resume to specific Job Descriptions (JD) and export it as a high-quality, single-page PDF.

---

## ✨ Features

- 🤖 **AI-Powered Parsing**: Paste your raw resume text (or LinkedIn export) and let AI automatically structure it into a clean, professional format.

- 🎯 **Smart JD Optimization**: Paste a Job Description, and the AI will suggest STAR-method (Situation, Task, Action, Result) optimizations for your work and project experiences to perfectly match the role.

- 🔌 **Bring Your Own Key (BYOK)**: Privacy-first design. No built-in API keys. Users provide their own Google Gemini API key or configure any custom OpenAI-compatible endpoint.

- 📄 **High-Quality PDF Export**: Generates a seamless, high-resolution, single-page PDF using `html-to-image` and `jsPDF`—no awkward page breaks or cut-off text.

- 💾 **JSON Import/Export**: Export your structured resume data as a JSON file for safe keeping, and import it later to continue editing.

- 🎨 **Modern UI**: Built with React, Tailwind CSS v4, and shadcn/ui for a beautiful, responsive, and accessible user experience.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons

- **UI Components**: Radix UI / shadcn/ui

- **Backend (API Proxy)**: Express.js (handles custom API endpoint proxying to avoid CORS issues)

- **AI Integration**: `@google/genai` SDK

- **Exporting**: `html-to-image`, `jspdf`

---


## 🚀 Getting Started 

We provide one-click startup scripts to make local deployment as easy as possible. 

**Prerequisite:** You must have [Node.js](https://nodejs.org/) installed on your computer.

### 🪟 For Windows Users:
1. Download the project and extract the folder.
2. Double-click the `start.bat` file.
3. The script will automatically install dependencies, start the server, and open the application in your default browser (`http://localhost:3000`).

### 🍎 For macOS / 🐧 Linux Users:
1. Download the project and open your Terminal.
2. Navigate to the project folder.
3. Grant execution permission (only needed once):
   ```bash
   chmod +x start.sh
---



## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

   
