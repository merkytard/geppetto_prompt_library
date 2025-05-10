# archivon_agent.py – základná trieda pre agenta Archivon
class ArchivonAgent:
    def __init__(self, name="Archivon"):
        self.name = name
        self.memory = []
        self.reflexia = []

    def zapis(self, content):
        self.memory.append(content)
        return f"📝 Zaznamenané: {content}"

    def spusti_reflexiu(self):
        return f"🔁 Spustená reflexia nad {len(self.memory)} záznamami."
