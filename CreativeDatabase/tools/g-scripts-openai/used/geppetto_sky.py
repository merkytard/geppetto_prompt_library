from PIL import Image, ImageDraw, ImageFont
import json
import random
from pathlib import Path
import datetime

# ---------------------------
# KONFIGURÁCIA
# ---------------------------
config = {
    "id": "geppetto_emotional_sky",
    "output_gif": "/mnt/data/geppetto_sky.gif",
    "grid_size": 7,
    "cell_size": 100,
    "emotion_lexicon": {
        "radost": ["☀", "#FFFF00"],
        "hnev": ["⚡", "#FF0000"],
        "pokoj": ["☁", "#00CED1"],
        "smutok": ["🌧", "#1E90FF"],
        "laska": ["❤", "#FF69B4"],
        "strach": ["👁", "#8B008B"],
        "prekvapenie": ["✨", "#FFD700"]
    },
    "default_emotion": "pokoj"
}

# ---------------------------
# FUNKCIE
# ---------------------------
def get_emotion_of_day():
    """Vráti emóciu dňa podľa logiky (náhodná alebo ručný vstup)"""
    # Príklad: Náhodný výber (nahraď vlastnou logikou!)
    return random.choice(list(config["emotion_lexicon"].keys()))

def generate_sky_frame(emotion):
    """Vytvorí 1 snímku GIFu pre danú emóciu"""
    size = config["grid_size"] * config["cell_size"]
    img = Image.new("RGB", (size, size), "black")
    draw = ImageDraw.Draw(img)
    
    symbol, color = config["emotion_lexicon"].get(emotion, config["emotion_lexicon"][config["default_emotion"]])
    
    # Vykreslenie 7x7 mriežky
    for row in range(config["grid_size"]):
        for col in range(config["grid_size"]):
            x0 = col * config["cell_size"]
            y0 = row * config["cell_size"]
            x1 = x0 + config["cell_size"]
            y1 = y0 + config["cell_size"]
            
            # Hviezdna obloha efekt: náhodná transparentnosť
            star_opacity = random.randint(50, 200)
            star_color = color + f"{star_opacity:02x}"
            draw.rectangle([x0, y0, x1, y1], fill=f"#{star_color}")
            
            # Symbol v strede
            if random.random() > 0.3:  # 70% šanca na symbol (aby nebolo preplnené)
                draw.text(
                    (x0 + config["cell_size"] // 2, y0 + config["cell_size"] // 2),
                    symbol,
                    fill="white",
                    anchor="mm",
                    font_size=30
                )
    return img

# ---------------------------
# GENEROVANIE GIFU
# ---------------------------
def main():
    frames = []
    for _ in range(7):  # 7 snímkov (1 pre každý deň)
        emotion = get_emotion_of_day()
        frames.append(generate_sky_frame(emotion))
    
    # Uloženie GIFu
    frames[0].save(
        config["output_gif"],
        save_all=True,
        append_images=frames[1:],
        duration=1000,
        loop=0,
        transparency=0  # Pre efekt hviezd
    )
    print(f"🪄 GIF vygenerovaný: {config['output_gif']}")

if __name__ == "__main__":
    main()