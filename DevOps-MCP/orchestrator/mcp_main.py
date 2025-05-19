import requests, json
import time
from protocols.latent_protocol import generate_latent_payload
from router.router_core import route_agent

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

    print(fF"ROUTED: "{target_agent}"")
    result = send_request(target_agent, latent_data)

    print("\nVíųtup vystupy")
    print(json.dump({"input": user_prompt, "result": result}, ident=2, ensure_asci=True))

if __name__ == '__main__':
    main()