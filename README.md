# Agentic SDLC
### An Autonomous Multi-Agent Framework for Self-Healing Documentation & Code Optimization

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/Library-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)


## 📖 Overview

**Agentic SDLC** is a next-generation devtool that employs a swarm of autonomous AI agents to accelerate the Software Development Life Cycle. By analyzing your codebase in real-time, it instantly provides professional documentation, rigorous quality audits, and performance optimization patches—all without human intervention.

Designed for modern developers, it features a security-first **Session-Key** architecture (zero persistence) and a premium dashboard for visualizing AI insights.

### [🚀 Try the Live Demo](https://agentic-sdlc-iota.vercel.app/)

---

## 📸 Integrated Dashboard

<div align="center">
  <img src="screenshots/Home.png" width="45%" alt="Home Dashboard" />
  <img src="screenshots/Documentation.png" width="45%" alt="Documentation Agent" />
</div>
<div align="center">
  <img src="screenshots/Quality%20Report.png" width="45%" alt="Quality Audit Agent" />
  <img src="screenshots/Optimization.png" width="45%" alt="Optimization Agent" />
</div>

---

## ✨ Key Features

### 🤖 Multi-Agent Swarm
Three specialized agents work in parallel using `asyncio` to deliver results in seconds:
1.  **Technical Writer Agent**: Transforms raw code into beautiful, structured Markdown documentation.
2.  **Quality Auditor Agent**: Performs static analysis to score Code Accuracy, Completeness, and Readability on a 10-point scale.
3.  **Performance Engineer Agent**: Identifies O(n) bottlenecks and proposes optimized, pythonic refactors.

### 🔒 Privacy & Security
-   **Session-Only Mode**: Your API Key is injected into the browser session RAM and never saved to the server disk.
-   **Ephemeral Processing**: Code is analyzed in memory and discarded immediately after report generation.

### ⚡ Modern UX
-   **Real-time Diff Viewer**: Compare original code vs. AI-optimized patches side-by-side.
-   **Glassmorphism Design**: sleek Dark/Light mode interface built with Tailwind & CSS variables.
-   **Interactive Feedback**: Visual loading steps showing which agent is currently active.

---

## 🏗 System Architecture

The project follows a decoupled formatting architecture for maximum scalability:

-   **Backend (Python/FastAPI)**:
    -   Handles Agent Orchestration via `google-genai` SDK.
    -   Implements robust error handling and fallback logic (Gemini 2.5 Flash -> 2.0 -> 1.5).
    -   Exposes a stateless REST API via `uvicorn`.

-   **Frontend (Next.js 14)**:
    -   Built with the App Router and Server Components.
    -   Responsive layout with custom `Inter` and `JetBrains Mono` typography.
    -   Seamlessly connects to any deployed backend via Environment Variables.

---

## 🚀 Quick Start

### Prerequisites
-   Python 3.9+
-   Node.js 18+
-   A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone & Setup Backend
```bash
git clone https://github.com/sciro24/Agentic-SDLC.git
cd Agentic-SDLC

# Create Virtual Env
python -m venv venv
source venv/bin/activate

# Install Deps
pip install -r requirements.txt

# Run Server (Port 8000)
./venv/bin/uvicorn src.app:app --reload
```

### 2. Setup Frontend
```bash
cd web
npm install

# Run Client (Port 3000)
npm run dev
```

### 3. Usage
Open `http://localhost:3000`. You will be prompted to enter your Google API Key securely. Once entered, drag & drop any `.py` file to start the swarm!

---

## 👨‍💻 Credits

Architected and Developed by **Diego Scirocco**.
*Powered by Google Deepmind Gemini Models.*
