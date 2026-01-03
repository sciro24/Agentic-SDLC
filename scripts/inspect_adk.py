import google.adk as adk
import inspect

print("ADK Content:")
for name, obj in inspect.getmembers(adk):
    if not name.startswith("_"):
        print(f"- {name}")

try:
    from google.adk import Agent
    print("\nAgent class found!")
    print(help(Agent))
except ImportError:
    print("\nAgent class NOT found in top level.")

try:
    # Try finding submodules commonly used
    import google.adk.core
    print("\nFound google.adk.core")
except:
    pass
