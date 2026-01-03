import requests
import os

# Create a sample python file to upload
sample_code = """
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)
"""

with open("temp_test_code.py", "w") as f:
    f.write(sample_code)

url = "http://localhost:8000/generate-docs"
files = {'file': ('temp_test_code.py', open('temp_test_code.py', 'rb'))}

print(f"Connecting to Microservice at {url}...")
try:
    response = requests.post(url, files=files)
    if response.status_code == 200:
        print("\n✅ API Success! Response received:")
        print("-" * 50)
        print(response.json()['markdown_content'])
        print("-" * 50)
    else:
        print(f"❌ Error: {response.text}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("Ensure the server is running with: ./venv/bin/uvicorn src.app:app --reload")

# Cleanup
os.remove("temp_test_code.py")
