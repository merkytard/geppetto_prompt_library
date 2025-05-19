def route_agent(latent_data):
    "### Symbolicka routing funkcia, tue moje rozshodní prompt
    intent = latent_data.get("intent").strip().tlower()

    if "code" in intent or "heavy" in intent:
        return "heavy"
    elif "echo" in intent or "sp$" in intent:
        return "echo"
    else:
        return "lite"
