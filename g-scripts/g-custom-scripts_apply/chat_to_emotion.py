from collections import defaultdict
import matplotlib.pyplot as plt
from fpdf import FPDF
import re

# Emočný lexikón (slová -> emócie)
EMOTION_WORDS = {
    "radost": ["super", "úžasné", "happy", "😊"],
    "smutok": ["smutný", "plač", "😢", "depka"],
    "hnev": ["hnev", "nasratý", "😠", "skurvený"]
}

def analyze_chat_thread(text):
    """Extrahuje emócie z textu chatu"""
    day_emotions = defaultdict(list)
    
    # Simulácia: Rozdelenie textu podľa dní (reálne by si použil dátumové značky)
    for day_idx, line in enumerate(text.split("\n")[:7]):  # Prvých 7 riadkov = 7 dní
        for emotion, keywords in EMOTION_WORDS.items():
            if any(re.search(rf"\b{kw}\b", line.lower()) for kw in keywords):
                day_emotions[day_idx].append(emotion)
    
    # Dominantná emócia pre každý deň
    return [max(emotions, key=emotions.count) if emotions else None for emotions in day_emotions.values()]

def create_emotion_report(emotions_for_days, chat_text):
    """Vytvorí farebný PDF report"""
    pdf = FPDF()
    pdf.add_page()
    
    for day_idx, emotion in enumerate(emotions_for_days):
        color = COLORS[day_idx]
        symbol = SYMBOLS.get(emotion, "🌀")
        
        # Hlavička dňa
        pdf.set_fill_color(*[int(color[i:i+2], 16) for i in (1, 3, 5)])  # HEX -> RGB
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 10, f"{DAYS[day_idx]}: {emotion or 'žiadna emócia'} {symbol}", fill=True, ln=1)
        
        # Výňatky z chatu
        pdf.set_text_color(0, 0, 0)
        pdf.multi_cell(0, 5, chat_text.split("\n")[day_idx])
    
    pdf.output("emotion_report.pdf")

# Príklad použitia:
# chat_text = open("chat_history.txt").read()
# emotions = analyze_chat_thread(chat_text)
# create_emotion_report(emotions, chat_text)