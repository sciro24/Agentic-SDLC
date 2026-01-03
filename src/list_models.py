import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(api_key=api_key)

try:
    print("Listing models...")
    for model in client.models.list(config={"page_size": 100}):
        print(model.name)
except Exception as e:
    print(f"Error listing models: {e}")
