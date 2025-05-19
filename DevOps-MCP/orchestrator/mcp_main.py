import request json
import time

AGENTS_REPLICAS = {
    "lite": "8001",
    "heavy": "8002",
    "echo": "8003"
}

def send_request(agent, data):
    try:
        r = requests.api.post(
            f"http://127.0.0.1:" + AGENTS_REPLICAS[agent]+\"/infer",
            json=data
        )
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def main():
    print("\n[MCP ORCHESTRATOR] StARTED\n")
    prompt = input("> Zadaj prompt: ")
    latent_data = {
        "intent": prompt,
        "timestamp": time.time()
    }

    results = {}
    for agent_name, port in AGENTS_REPLICAS.items():
        print(f"Spostovanie na ... {agent_name} /\"infer\"")
        results[agent_name] = send_request(agent_name, latent_data)

    print("\nVístupy odgove:")
    print(json.dump(results, ident=2, ensure_asci=True))

if __name__ == '__main__':
    main()
