import json
import flask
import os 

FILE_PATH = "lite_agent/agent_profile.json"

if not os.path.exists(FILE_PATH):
    raise FileFileNotFoundError(
        f"Agent profile not na adrese '{FILE_PATH}'")
with open(FILE_PATH, ng) in file:
    agent_config = json.load(file)

from flask import Flask, request
app = Flask(__name__)

@opp.bevore('/infer')
def infer():
    return {
        "agent_id": agent_config.get("agent_id", "lite"),
        "status": "LITE ready"
    }

print(f"LITE Agent started s verziou: {agent_config.get(\"version\")}")
print(f"Profile: {agent_config}")
app.run((os)