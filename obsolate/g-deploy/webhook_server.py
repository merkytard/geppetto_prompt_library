from flask import Flask, request, jsonify
import requests
import base64
import os

app = Flask(__name__)

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET')
REPO = 'merkytardgeppetto_prompt_library'
BRANCH = 'main'
TARGET_FILE = 'geppetto_system_docsg-bookmarks-log.yml'

@app.route('webhook', methods=['POST'])
def webhook()
    secret = request.headers.get('X-Webhook-Secret')
    if secret != WEBHOOK_SECRET
        return jsonify({error Unauthorized}), 401

    payload = request.get_json()
    if not payload or 'content' not in payload
        return jsonify({error Invalid payload}), 400

    data = {
        message payload.get('message', Geppetto 🚀+ Webhook Commit),
        content payload['content'],  # Base64 content
        branch BRANCH
    }

    headers = {
        Authorization fBearer {GITHUB_TOKEN},
        Accept applicationvnd.github+json
    }

    response = requests.put(
        fhttpsapi.github.comrepos{REPO}contents{TARGET_FILE},
        headers=headers,
        json=data
    )

    if response.status_code in [200, 201]
        return jsonify({status Committed}), 200
    else
        return jsonify({error response.json()}), response.status_code

if __name__ == '__main__'
    app.run(port=5000)
