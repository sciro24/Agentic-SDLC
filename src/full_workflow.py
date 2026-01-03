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
            "gemini-2.0-flash-lite-preview-02-05",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro"
        ]

    def _generate(self, prompt: str) -> str:
        last_error = None
        for model in self.model_candidates:
            try:
                # print(f"Trying model: {model}...") 
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
        return f"Error generating content: {last_error}"

    def run_workflow(self, code_content: str) -> Dict[str, Any]:
        results = {
            "documentation": "",
            "evaluation": {},
            "optimization": None
        }

        print(">>> [ADK] Starting Workflow...")

        # 1. Documentation Agent
        print(">>> [ADK] Agent: Technical Writer running...")
        doc_prompt = f"""
        You are an expert Technical Writer using the Google ADK methodology.
        Generate comprehensive Markdown documentation for this code.
        Include:
        - Overview
        - Function Signatures & Complexity (Big O)
        - Usage Examples
        
        Code:
        ```python
        {code_content}
        ```
        """
        results["documentation"] = self._generate(doc_prompt)

        # 2. Evaluation Agent
        print(">>> [ADK] Agent: Quality Auditor running...")
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
        eval_raw = self._generate(eval_prompt)
        
        # Parse JSON
        try:
            # Strip markdown code blocks if present
            clean_json = re.sub(r'```json|```', '', eval_raw).strip()
            eval_data = json.loads(clean_json)
            
            # Flatten for frontend convenience
            results["evaluation"] = {
                "technical_accuracy": eval_data.get("scores", {}).get("technical_accuracy", 0),
                "completeness": eval_data.get("scores", {}).get("completeness", 0),
                "readability": eval_data.get("scores", {}).get("readability", 0),
                "feedback": eval_data.get("feedback", "No feedback provided."),
                "needs_optimization": eval_data.get("needs_optimization", False)
            }
        except Exception as e:
            print(f"JSON Parsing failed: {e}")
            results["evaluation"] = {
                "technical_accuracy": 0,
                "completeness": 0,
                "readability": 0,
                "feedback": f"Failed to parse Agent output: {eval_raw}",
                "needs_optimization": True
            }

        # 3. Optimization Agent (Conditional)
        if results["evaluation"].get("needs_optimization", True):
            print(">>> [ADK] Agent: Performance Optimizer running...")
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
            opt_raw = self._generate(opt_prompt)
            # Extract code
            match = re.search(r'```python\s*(.*?)\s*```', opt_raw, re.DOTALL)
            if match:
                results["optimization"] = match.group(1)
            else:
                results["optimization"] = opt_raw # Fallback

        print(">>> [ADK] Workflow Complete.")
        return results
