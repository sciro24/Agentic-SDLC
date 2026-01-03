import os
import sys
import json
import re
from dotenv import load_dotenv
from google import genai

# Setup path and env
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.append(root_dir)

# Load .env explicitly from root
load_dotenv(os.path.join(root_dir, ".env"))

class AgenticDocGenerator:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment.")
        self.client = genai.Client(api_key=self.api_key)
        self.writer_model = "gemini-2.0-flash-lite-preview-02-05"
        self.fallback_model = "gemini-flash-latest"
        self.trace_logs = []

    def _log_trace(self, role, thought, action):
        entry = {
            "timestamp": os.popen("date -u +%Y-%m-%dT%H:%M:%SZ").read().strip(),
            "role": role,
            "thought_process_prompt": thought,
            "action_output": action
        }
        self.trace_logs.append(entry)
        
    def _save_logs(self):
        filename = f"trace_{os.popen('date +%s').read().strip()}.json"
        log_path = os.path.join(root_dir, "logs", filename)
        with open(log_path, "w") as f:
            json.dump(self.trace_logs, f, indent=2)
        print(f"Trace saved to {log_path}")

    def _get_model_response(self, prompt, role="Assistant"):
        print(f"[{role}] Thinking...")
        response_text = None
        try:
            response = self.client.models.generate_content(
                model=self.writer_model, 
                contents=prompt
            )
            response_text = response.text
        except Exception as e:
            print(f"[{role}] Error with {self.writer_model}: {e}. Trying fallback...")
            try:
                response = self.client.models.generate_content(
                    model=self.fallback_model,
                    contents=prompt
                )
                response_text = response.text
            except Exception as e2:
                print(f"[{role}] Fatal Error: {e2}")
                return None
        
        if response_text:
            self._log_trace(role, prompt, response_text)
            
        return response_text

    def generate_documentation(self, code_content, max_retries=3):
        for attempt in range(max_retries):
            print(f"\n--- Workflow Attempt {attempt + 1}/{max_retries} ---")
            
            # 1. Writer Agent
            writer_prompt = f"""
            You are a Senior Technical Writer. Analyze the following Python code and generate professional Markdown documentation.
            Focus on:
            - High-level purpose.
            - Algorithmic complexity (Big O) for each function.
            - Input/Output description.
            
            Code:
            ```python
            {code_content}
            ```
            
            Output ONLY the Markdown content.
            """
            print(">>> WRITER AGENT: Generating Draft...")
            draft_doc = self._get_model_response(writer_prompt, role="Writer")
            if not draft_doc:
                continue

            # 2. Reviewer Agent (The Critic)
            reviewer_prompt = f"""
            You are a Senior Code Reviewer. Review the following documentation draft for the provided code.
            Check for:
            1. Accuracy of Big O notation.
            2. Clarity of explanations.
            3. Completeness.
            
            If it's mostly good, fix any small issues and output the improved Markdown version.
            If it's bad, rewrite it completely.
            
            Output ONLY the improved Markdown content.
            
            Code:
            ```python
            {code_content}
            ```
            
            Documentation Draft:
            {draft_doc}
            """
            print(">>> REVIEWER AGENT: Refining Draft...")
            refined_doc = self._get_model_response(reviewer_prompt, role="Reviewer")
            if not refined_doc:
                continue

            # 3. Evaluator Agent (Quantitative Metrics)
            print(">>> EVALUATOR AGENT: Scoring...")
            eval_prompt = f"""
            You are a QA Auditor. Evaluate the following documentation against the code.
            Return a JSON object with scores (1-10) for:
            - technical_accuracy (Big O correctness, logic description)
            - completeness (params, return values)
            - readability (formatting, clarity)
            
            Also provide a 'mean_score'.
            
            Format:
            ```json
            {{
                "technical_accuracy": 9.0,
                "completeness": 8.0,
                "readability": 9.5,
                "mean_score": 8.8,
                "feedback": "..."
            }}
            ```
            Output ONLY valid JSON.
            
            Code:
            ```python
            {code_content}
            ```
            
            Documentation:
            {refined_doc}
            """
            eval_response = self._get_model_response(eval_prompt, role="Evaluator")
            
            try:
                # Extract JSON if wrapped in markdown blocks
                json_match = re.search(r'```json\s*(\{.*?\})\s*```', eval_response, re.DOTALL)
                if json_match:
                    json_str = json_match.group(1)
                else:
                    json_str = eval_response
                
                metrics = json.loads(json_str)
                print(f"Scores: {metrics}")
                
                # Save report
                with open(os.path.join(root_dir, "EVALUATION_REPORT.json"), "w") as f:
                    json.dump(metrics, f, indent=2)

                if metrics.get("mean_score", 0) >= 8.5:
                    print(">>> SUCCESS: Quality Threshold Met!")
                    return refined_doc
                else:
                    print(f">>> RETRY: Score {metrics.get('mean_score')} < 8.5. Feedback: {metrics.get('feedback')}")
            except Exception as e:
                print(f"Evaluator parsing error: {e}. Output was: {eval_response}")
                
        raise Exception("Documentation failed to meet quality standards after max retries.")

def main():
    target_file = "logic_processor.py"
    file_path = os.path.join(current_dir, target_file)
    with open(file_path, 'r') as f:
        code_content = f.read()
    
    generator = AgenticDocGenerator()
    try:
        final_doc = generator.generate_documentation(code_content)
        output_path = os.path.join(root_dir, "DOCS_LOGIC.md")
        with open(output_path, "w") as f:
            f.write(final_doc)
        print(f"Documentation saved to {output_path}")
        generator._save_logs()
    except Exception as e:
        print(f"Workflow failed: {e}")
        generator._save_logs()

if __name__ == "__main__":
    main()
