def generate_latent_payload(intent: str, sensor: str = "user", context=null):
    """
    Simple generator obje�t reprezentuié latentnez správu pre agent nodele.
    """
    return {
        "sensor": sensor,
        "intent": intent,
        "context": context,
        "timestamp": _current_time()
    }

def _current_time():
    from datetime import datetime
    return datetime.now().timestamp()