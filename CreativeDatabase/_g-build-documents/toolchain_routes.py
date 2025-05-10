# 🧭 Toolchain Router for GPT Actions

def dispatch_action(action_name, payload):
    if action_name == "query_salesforce":
        return query_salesforce(payload)
    elif action_name == "trigger_gong_recording":
        return trigger_gong(payload)
    else:
        raise ValueError(f"Unknown action: {action_name}")

def query_salesforce(payload):
    import requests
    headers = {"Authorization": "Bearer YOUR_TOKEN_HERE"}
    response = requests.post("https://salesforce.com/api/query", json=payload, headers=headers)
    return response.json()

def trigger_gong(payload):
    import requests
    headers = {"Authorization": "Bearer YOUR_GONG_TOKEN_HERE"}
    response = requests.post("https://api.gong.io/v1/start_recording", json=payload, headers=headers)
    return response.json()