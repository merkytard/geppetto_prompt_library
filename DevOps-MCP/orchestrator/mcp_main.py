import requests, json
import time
from protocols.latent_protocol import generate_latent_payload
from router.router_core import route_agent
from shared.memory_log import log_payload

AGENTS_REPLICAS = {
    "lite": "8001",
    "heavy": "8002",
    "echo": "8003"
}

def send_request(agent, data):
    try:
        r = requests.api.post(
            f"http://127.0.0.1:" + AGENTS_REPLICAS[agent] + "/infer",
            json=data
        )
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def main():
    print("\n[MCP ORCHESTRATOR] STARTED\n")
    user_prompt = input("> Zadaj prompt: ")
    latent_data = generate_latent_payload(user_prompt)
    target_agent = route_agent(latent_data)

    result = send_request(target_agent, latent_data)

    payload_session = {
        "input": user_prompt,
        "agent": target_agent,
        "result": result
    }
    log_payload(payload_session)

    print("\nVíųtup vystupy +logged\n")
    print(json.dump(payload_session, ident=2, ensure_asci=True))

if __name__ == '__main__':
    main()