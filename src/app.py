from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from src.full_workflow import ADKWorkflow
import uvicorn
import os

app = FastAPI(title="Agentic SDLC API", version="2.0")

# Input/Output Models
class AnalysisResponse(BaseModel):
    documentation: str
    evaluation: Dict[str, Any]
    optimization: Optional[str] = None
    original_code: str
    status: str

# CORS Setup for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
workflow = ADKWorkflow()

@app.get("/")
def health_check():
    return {"status": "ok", "system": "Agentic SDLC"}

@app.post("/analyze-code", response_model=AnalysisResponse)
async def analyze_code(file: UploadFile):
    if not file.filename.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only .py files are supported.")
    
    try:
        content = await file.read()
        code_str = content.decode("utf-8")
        
        # Run the multi-agent workflow
        result = await workflow.run_workflow(code_str)
        
        return AnalysisResponse(
            documentation=result["documentation"],
            evaluation=result["evaluation"],
            optimization=result["optimization"],
            original_code=code_str, # Return original code for diffing
            status="completed"
        )
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("src.app:app", host="0.0.0.0", port=8000, reload=True)
