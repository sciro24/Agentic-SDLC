import os
import json
import re
from google import genai
from typing import Dict, Any, Optional

# Load env in app.py usually, but good to have safety
from dotenv import load_dotenv
load_dotenv()

class ADKWorkflow:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY missing.")
        
        self.client = genai.Client(api_key=self.api_key)
        # Prioritize 2.5-flash as requested, then fall back to others
        self.model_candidates = [
            "gemini-2.5-flash", 
            "gemini-2.0-flash", 
            "gemini-2.0-flash-lite-preview-02-05", # Latest Preview
            "gemini-1.5-flash",
            "gemini-1.5-pro"
        ]

    async def _generate_async(self, prompt: str) -> str:
        # Wrap synchronous blocking call in a thread
        import asyncio
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._generate_sync, prompt)

    def _generate_sync(self, prompt: str) -> str:
        last_error = None
        for model in self.model_candidates:
            try:
                res = self.client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                return res.text
            except Exception as e:
                # print(f"Model {model} failed: {e}")
                last_error = e
                continue
        print(f"All models failed. Last error: {last_error}")
        raise RuntimeError(f"All AI models failed. Last error: {last_error}")

    async def run_workflow(self, code_content: str) -> Dict[str, Any]:
        results = {
            "documentation": "",
            "evaluation": {},
            "optimization": None
        }

        print(">>> [ADK] Starting Parallel Workflow...")
        
        # Define Prompts
        doc_prompt = f"""
        You are an expert Technical Writer using the Google ADK methodology.
        Generate comprehensive Markdown documentation for this code.
        
        CRITICAL INSTRUCTION:
        Output ONLY the documentation content itself. 
        Do NOT include any introductory or concluding meta-commentary like "Here is the documentation" or "This document adheres to..."
        Start directly with the Title (H1).

        Include:
        - Overview
        - Function Signatures & Complexity (Big O)
        - Usage Examples
        
        Code:
        ```python
        {code_content}
        ```
        """
        
        eval_prompt = f"""
        You are a QA Lead. Evaluate the User's code.
        Output strictly JSON format.
        
        Metrics (1-10):
        - technical_accuracy
        - completeness
        - readability
        
        Fields:
        - scores (object with metrics)
        - feedback (string summary)
        - needs_optimization (boolean)
        
        Code:
        ```python
        {code_content}
        ```
        Output only JSON.
        """
        
        opt_prompt = f"""
        You are a Performance Engineer.
        Optimize the following Python code for Time and Space complexity.
        If the code is already optimal, just return the original.
        Return ONLY the Python code block.
        
        Code:
        ```python
        {code_content}
        ```
        """

        # Execute in Parallel
        import asyncio
        task_doc = asyncio.create_task(self._generate_async(doc_prompt))
        task_eval = asyncio.create_task(self._generate_async(eval_prompt))
        task_opt = asyncio.create_task(self._generate_async(opt_prompt))

        print(">>> [ADK] Agents Running concurrently...")
        
        # Wait for all, allowing exceptions to bubble up if we want, or catching them.
        # We need to catch individual failures so one failure doesn't crash others, potentially.
        # BUT user said "if error, don't show sections". So failing the whole request is actually desired behavior.
        try:
            doc_res, eval_res, opt_res = await asyncio.gather(task_doc, task_eval, task_opt)
        except Exception as e:
            print(f"Workflow failed: {e}")
            raise e # Re-raise to app.py which handles 500

        results["documentation"] = doc_res
        
        # Process Eval
        # Process Eval
        try:
             # Robust JSON extraction
            clean_json = eval_res
            # 1. Try regex for code block
            match_code = re.search(r'```json\s*(.*?)\s*```', eval_res, re.DOTALL)
            if match_code:
                clean_json = match_code.group(1)
            else:
                 # 2. Try regex for any curly brace block (greedy)
                match_brace = re.search(r'\{.*\}', eval_res, re.DOTALL)
                if match_brace:
                    clean_json = match_brace.group(0)
            
            # Clean comments if any (simple approach) or let json.loads try
            eval_data = json.loads(clean_json)
            
            results["evaluation"] = {
                "technical_accuracy": eval_data.get("scores", {}).get("technical_accuracy", 0),
                "completeness": eval_data.get("scores", {}).get("completeness", 0),
                "readability": eval_data.get("scores", {}).get("readability", 0),
                "feedback": eval_data.get("feedback", "No feedback provided."),
                "needs_optimization": eval_data.get("needs_optimization", False)
            }
        except Exception as e:
            print(f"JSON Parsing failed: {e}")
            results["evaluation"] = {"feedback": "Error parsing evaluation", "needs_optimization": False}

        # Process Opt (Only keep if needed or if optimization was actually generated)
        # Note: We ran it in parallel speculatively to save time. 
        # We can discard it if needs_optimization is False, OR just show it anyway.
        # User requested "needs optimization" logic. 
        # If we want to strictly follow the logic, we check eval result.
        if results["evaluation"].get("needs_optimization", True):
             match = re.search(r'```python\s*(.*?)\s*```', opt_res, re.DOTALL)
             results["optimization"] = match.group(1) if match else opt_res
        else:
             results["optimization"] = None

        print(">>> [ADK] Workflow Complete.")
        return results
