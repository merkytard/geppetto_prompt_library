# server_handler.py

import subprocess
import sys
import os

class ServerHandler:
    def __init__(self):
        self.process = None

    def start_server(self, port=3000):
        if self.process:
            print("Server already running!")
            return

        # Create a simple FastAPI app dynamically if needed
        if not os.path.exists("server_app.py"):
            with open("server_app.py", "w") as f:
                f.write("""
from fastapi import FastAPI

app = FastAPI()

@app.get("/status")
async def status():
    return {"status": "Server is running!", "port": 3000}
""")

        print("Starting server on port", port)
        self.process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", "server_app:app", "--port", str(port), "--reload"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def stop_server(self):
        if self.process:
            print("Stopping server...")
            self.process.terminate()
            self.process.wait()
            self.process = None
        else:
            print("No server to stop!")

# api_manager.py

import requests

class APIManager:
    def __init__(self, api_key=""):
        self.api_key = api_key

    def set_api_key(self, key):
        self.api_key = key

    def test_api_key(self):
        if not self.api_key:
            return False, "No API key set."

        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }

        try:
            response = requests.get("https://api.openai.com/v1/models", headers=headers, timeout=5)
            if response.status_code == 200:
                return True, "API Key is valid!"
            else:
                return False, f"Invalid API Key! Status Code: {response.status_code}"
        except Exception as e:
            return False, str(e)

# Usage Example (connect with Tkinter later)
if __name__ == "__main__":
    server = ServerHandler()
    server.start_server()

    api_manager = APIManager(api_key="your-openai-api-key")
    success, message = api_manager.test_api_key()
    print("API Test:", message)

    input("Press Enter to stop server...")
    server.stop_server()
