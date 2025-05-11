# geppetto-dashboard/main.py

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv, dotenv_values, set_key
import os
import uvicorn
import logging

# --- Setup ---
load_dotenv()

ENV_PATH = ".env"

app = FastAPI(title="Geppetto Dashboard", version="0.2")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(filename="logs/dashboard.log", level=logging.INFO)

# In-memory state cache
system_state = {
    "openai_status": "unknown",
    "github_status": "unknown",
    "logs": []
}

# --- Routes ---
@app.get("/", response_class=HTMLResponse)
async def index():
    return HTMLResponse(
        content="""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Geppetto Dashboard</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #111; color: #eee; padding: 2rem; }
                h1 { color: #0f0; }
                .log { font-size: 0.9rem; margin: 0.2rem 0; }
                .status { margin-bottom: 1rem; }
                .ok { color: #0f0; }
                .fail { color: #f00; }
                label { display: block; margin-top: 1rem; }
                input[type=text] { width: 400px; padding: 4px; }
                button { margin-top: 1rem; padding: 6px 12px; }
                hr { margin: 2rem 0; }
            </style>
        </head>
        <body>
            <h1>Geppetto Dashboard</h1>
            <div class="status">
                <strong>OpenAI:</strong> <span id="openai_status">...</span><br>
                <strong>GitHub:</strong> <span id="github_status">...</span>
            </div>
            <h2>Logs</h2>
            <div id="log_output"></div>
            <hr>
            <h2>Config (.env)</h2>
            <form method="post" action="/config">
                <label for="OPENAI_API_KEY">OPENAI_API_KEY:</label>
                <input type="text" name="OPENAI_API_KEY" value="" />

                <label for="WEBHOOK_SECRET">WEBHOOK_SECRET:</label>
                <input type="text" name="WEBHOOK_SECRET" value="" />

                <label for="GITHUB_TOKEN">GITHUB_TOKEN:</label>
                <input type="text" name="GITHUB_TOKEN" value="" />

                <button type="submit">Save Config</button>
            </form>
            <script>
                async function fetchStatus() {
                    const res = await fetch('/status');
                    const data = await res.json();
                    document.getElementById('openai_status').textContent = data.openai_status;
                    document.getElementById('github_status').textContent = data.github_status;
                }
                async function fetchLogs() {
                    const res = await fetch('/logs');
                    const data = await res.json();
                    const container = document.getElementById('log_output');
                    container.innerHTML = '';
                    data.logs.forEach(log => {
                        const div = document.createElement('div');
                        div.className = 'log';
                        div.textContent = log;
                        container.appendChild(div);
                    });
                }
                setInterval(() => { fetchStatus(); fetchLogs(); }, 2000);
                fetchStatus();
                fetchLogs();
            </script>
        </body>
        </html>
        """,
        status_code=200
    )

@app.get("/status")
async def get_status():
    return JSONResponse(content={
        "openai_status": system_state["openai_status"],
        "github_status": system_state["github_status"]
    })

@app.post("/log")
async def post_log(request: Request):
    data = await request.json()
    message = data.get("message", "(no message)")
    system_state["logs"].append(message)
    logging.info(message)
    return {"status": "logged"}

@app.get("/logs")
async def get_logs():
    return JSONResponse(content={"logs": system_state["logs"][-100:]})

@app.post("/config")
async def save_config(
    OPENAI_API_KEY: str = Form(...),
    WEBHOOK_SECRET: str = Form(...),
    GITHUB_TOKEN: str = Form(...)
):
    set_key(ENV_PATH, "OPENAI_API_KEY", OPENAI_API_KEY)
    set_key(ENV_PATH, "WEBHOOK_SECRET", WEBHOOK_SECRET)
    set_key(ENV_PATH, "GITHUB_TOKEN", GITHUB_TOKEN)
    return RedirectResponse(url="/", status_code=302)

@app.get("/ping")
async def ping():
    return {"pong": True}

# --- Main ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=3000, reload=True)
