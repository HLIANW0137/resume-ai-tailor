# AI Resume Builder README.md

[简体中文](./README_CN.md) | [English](./README.md)

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


## 📖 How to Use

1. **Configure API Key:**

    - Click the Settings icon (⚙️) in the top right corner.

    - Enter your Gemini API Key.

    - (Optional) If you want to use a custom OpenAI-compatible API (like DeepSeek, Claude via proxy, etc.), enter the Base URL and the corresponding API Key.

2. **Parse Resume:**

    - Switch to the "Parse" tab.

    - Paste your raw resume text and click Parse Resume. The AI will automatically populate the editor.

3. **Optimize for a Job:**

    - Switch to the "Optimize" tab.

    - Paste the Job Description (JD) of the role you are applying for.

    - Click Optimize Resume. Review the AI's proposed changes and click "Accept" to apply them to your resume.

4. **Export:**

    - Click Export -> Export as PDF to download your high-quality resume.

    - Click Export -> Export JSON to save your data locally.

---

## 🔧 Customization & Adjustment

This project is designed to be highly customizable. Here is how you can adjust it to your needs:

### 1. Adjusting AI Prompts

If you want to change how the AI parses text or optimizes the resume, you can modify the prompts in `src/services/ai.ts`.

- **Parsing Prompt**: Locate the `parseResume` function. You can add new fields to the JSON schema or change the instructions.

- **Optimization Prompt**: Locate the `optimizeResume` function. You can adjust the tone, language, or methodology (e.g., change from STAR method to XYZ method).

### 2. Modifying the Resume Theme/Styles

The resume preview is styled using Tailwind CSS.

- To change colors, fonts, or spacing of the generated resume, edit the ResumePreview component (usually located in `src/App.tsx` or `src/components/ResumePreview.tsx`).

- Global styles and Tailwind variables can be adjusted in `src/index.css`.

### 3. Tweaking PDF Export Settings

The PDF export uses `html-to-image` to capture the DOM. If you need to adjust the resolution or background color, locate the `handlePrint` function in `src/App.tsx`:

```javascript

const dataUrl = await toPng(resumeRef.current, { 
  quality: 1.0, 
  pixelRatio: 2, // Increase for higher resolution, decrease for smaller file size
  backgroundColor: '#ffffff',
  width: widthPx,
  height: heightPx
});
```

### 4. Adding New Resume Sections

To add a new section (e.g., "Certifications"):

1. Update the `ResumeData` interface in `src/types.ts`.

2. Update the JSON schema in the `parseResume` function in `src/services/ai.ts`.

3. Add the corresponding UI inputs in the Editor section and the display logic in the Preview section within `src/App.tsx`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the Project

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)

4. Push to the Branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
