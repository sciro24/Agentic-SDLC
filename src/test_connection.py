import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("ERRORE: Variabile GOOGLE_API_KEY non trovata nel file .env")
    exit()

client = genai.Client(api_key=api_key)

def try_model(model_id):
    print(f"Tentativo con: {model_id}...")
    try:
        response = client.models.generate_content(
            model=model_id, 
            contents="Rispondi solo con la parola 'CONNESSO'."
        )
        print(f"RISULTATO: {response.text.strip()}")
        return True
    except Exception as e:
        print(f"FALLITO: {e}\n")
        return False

# Lista di modelli verificati (basata su output di list_models.py)
candidate_models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-flash-latest", # Spesso punta alla versione stabile corrente (es. 1.5 Flash)
    "gemini-1.5-pro-latest"
]

success = False
for model in candidate_models:
    # Alcune varianti richiedono il prefisso 'models/', altre no. Testiamo entrambe.
    if try_model(model):
        success = True
        break
    if try_model(f"models/{model}"):
        success = True
        break

if not success:
    print("Tutti i tentativi sono falliti. Verifica la tua quota (Error 429) o la validità della chiave API.")