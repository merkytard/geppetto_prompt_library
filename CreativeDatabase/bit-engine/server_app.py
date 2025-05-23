
from fastapi import FastAPI

app = FastAPI()

@app.get("/status")
async def status():
    return {"status": "Server is running!", "port": 3000}
