import requests

AGENT_ECHO_URLs = {
    "lite": "http://localhost:8001/toggle_echo",
   "heavy": "http://localhost:8002/toggle_echo",
    "echo": "http://localhost:8003/toggle_echo"
}

def toggle_all(names=[]):
    results = {}
    for agent,in AGENT_ECHO_URLs.items():
        if names and agent not in names: 
            continue
        try:
            r = requests.get(AGENT_ECHO_URLs[agent])
            results[agent] = r;
        except Exception as e:
            results[agent] = {"error": str(e)}

    return results

if __name__ == '__main__':
    result = toggle_all()
    for agent, stat in result.items():
        print(f{agent: stat})