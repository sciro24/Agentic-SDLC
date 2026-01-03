import os
import sys
import re
from dotenv import load_dotenv
from google import genai

# Setup path and env
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.append(root_dir)
load_dotenv(os.path.join(root_dir, ".env"))

class OptimizerAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = "gemini-2.0-flash-lite-preview-02-05"
        self.fallback = "gemini-flash-latest"

    def _call_llm(self, prompt):
        try:
            res = self.client.models.generate_content(model=self.model, contents=prompt)
            return res.text
        except:
            res = self.client.models.generate_content(model=self.fallback, contents=prompt)
            return res.text

    def optimize_code(self, file_path):
        with open(file_path, 'r') as f:
            code = f.read()

        print(">>> OPTIMIZER: Analyzing for bottlenecks...")
        prompt = f"""
        You are a Senior Python Performance Engineer.
        Analyze the following code for inefficient algorithms or pythonic anti-patterns.
        If you find a significant optimization (e.g. O(n^2) to O(n)), provide the FULL rewritten code.
        Ensure you keep exactly the same class names and function signatures so tests don't break.
        
        Code:
        ```python
        {code}
        ```
        
        Output only the python code block.
        """
        
        optimized_code_raw = self._call_llm(prompt)
        
        # Extract code
        match = re.search(r'```python\s*(.*?)\s*```', optimized_code_raw, re.DOTALL)
        if match:
            optimized_code = match.group(1)
        else:
            print("No optimization suggested or parse error.")
            return False

        print(">>> OPTIMIZER: Proposed changes found. Applying patch...")
        
        # Backup original
        backup_path = file_path + ".bak"
        with open(backup_path, 'w') as f:
            f.write(code)
            
        # Write new
        with open(file_path, 'w') as f:
            f.write(optimized_code)
            
        print(">>> OPTIMIZER: Verifying patch with tests...")
        
        # Run tests
        # Assumes test_logic.py is in the same folder
        test_path = os.path.join(current_dir, 'test_logic.py')
        # Use the current python interpreter (which is from the venv)
        test_res = os.system(f'"{sys.executable}" "{test_path}"')
        
        if test_res == 0:
            print(">>> STATUS: OPTIMIZATION SUCCESSFUL. Tests passed.")
            os.remove(backup_path)
            return True
        else:
            print(">>> STATUS: OPTIMIZATION FAILED TESTS. Reverting...")
            with open(backup_path, 'r') as f:
                original = f.read()
            with open(file_path, 'w') as f:
                f.write(original)
            return False

if __name__ == "__main__":
    agent = OptimizerAgent()
    agent.optimize_code(os.path.join(current_dir, "logic_processor.py"))
