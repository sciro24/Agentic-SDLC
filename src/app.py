from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel
from src.multi_agent_doc_gen import AgenticDocGenerator
import uvicorn
import os

app = FastAPI(title="Agentic Doc Validator API", version="1.0")
generator = AgenticDocGenerator()

class DocResponse(BaseModel):
    markdown_content: str
    status: str

@app.post("/generate-docs", response_model=DocResponse)
async def generate_docs(file: UploadFile):
    if not file.filename.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only .py files are allowed")
    
    try:
        content = await file.read()
        code_str = content.decode("utf-8")
        
        # Run agentic workflow
        final_doc = generator.generate_documentation(code_str)
        
        return DocResponse(markdown_content=final_doc, status="optimized_and_approved")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
