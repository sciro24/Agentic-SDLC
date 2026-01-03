# Agentic SDLC

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Try_Now-success?style=for-the-badge&logo=vercel)](https://agentic-sdlc-iota.vercel.app/)

## Overview
Agentic SDLC is an intelligent, automated development tool designed to streamline the software lifecycle. Leveraging Google's advanced Gemini models and an Agentic workflow, it provides instant documentation, quality audits, and code optimization proposals through a unified, modern interface.

### [🚀 Try the Live Demo](https://agentic-sdlc-iota.vercel.app/)

## Visual Walkthrough

<div align="center">
  <img src="screenshots/Home.png" width="45%" alt="Home Dashboard" />
  <img src="screenshots/Documentation.png" width="45%" alt="Documentation" />
</div>
<div align="center">
  <img src="screenshots/Quality%20Report.png" width="45%" alt="Quality Audit" />
  <img src="screenshots/Optimization.png" width="45%" alt="Optimization" />
</div>

## Key Features
- **Automated Documentation**: Utilizes a Technical Writer Agent to generate comprehensive, professional Markdown documentation.
- **Quality Assurance**: A Quality Auditor Agent inspects code for accuracy, completeness, and readability.
- **Performance Engineering**: A Performance Engineer Agent identifies bottlenecks and automatically proposes optimized code solutions.
- **Parallel Processing**: Powered by `asyncio` for rapid, concurrent multi-agent analysis.
- **Modern Dashboard**: A responsive Next.js web interface featuring Dark/Light modes, visual diffing, and real-time status updates.

## Architecture
The system consists of two main components:
1.  **Backend (Python/FastAPI)**: Orchestrates the multi-agent swarm using `google-genai`. It handles the prompt engineering and model fallback logic.
2.  **Frontend (Next.js)**: Provides a premium user experience for file uploads, result visualization, and code comparison.

## Project Structure
- `src/`: Core backend source code (API and Workflow Engine).
- `web/`: Frontend application (Next.js).
- `tests/`: Unit and integration tests.
- `scripts/`: Utility and benchmark scripts.
- `eval_set/`: Sample code files for evaluation.

## Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### Backend Setup
1.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure Environment:
    Create a `.env` file in the root directory:
    ```env
    GOOGLE_API_KEY=your_api_key_here
    ```

### Frontend Setup
1.  Navigate to the web directory:
    ```bash
    cd web
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

### 1. Start the Backend
From the project root:
```bash
./venv/bin/uvicorn src.app:app --reload
```
The API will run at `http://localhost:8000`.

### 2. Start the Frontend
From the project root:
```bash
npm run dev --prefix web
```
The Dashboard will be accessible at `http://localhost:3000`.

### 3. Analyze Code
1.  Open the Dashboard.
2.  Upload a Python (`.py`) file.
3.  View the real-time analysis across Documentation, Quality Audit, and Optimization tabs.

## Credits
Created by **Diego Scirocco**.
Powered by Google Gemini Models.
