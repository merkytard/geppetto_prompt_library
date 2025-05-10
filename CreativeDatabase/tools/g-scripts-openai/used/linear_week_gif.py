from PIL import Image, ImageDraw
import json

# Konštanty
DAYS = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"]
COLORS = ["#1E90FF", "#2E8B57", "#FFD700", "#FF8C00", "#FF0000", "#9400D3", "#FFFFFF"]  # Farba pre každý deň
SYMBOLS = {"radost": "☀", "smutok": "🌧", "hnev": "⚡", "pokoj": "☁", "laska": "❤", "strach": "👁", "prekvapenie": "✨"}

def create_linear_gif(emotions_for_days):
    """Vytvorí GIF s 7 štvorcami (1 pre každý deň)"""
    frames = []
    width, height = 700, 100  # 7 štvorcov x 100px
    
    for day_idx in range(7):
        img = Image.new("RGB", (width, height), "white")
        draw = ImageDraw.Draw(img)
        
        # Vykreslenie 7 dní vedľa seba
        for i in range(7):
            x0, y0 = i * 100, 0
            x1, y1 = x0 + 100, 100
            draw.rectangle([x0, y0, x1, y1], fill=COLORS[i])
            
            # Symbol podľa emócie (ak je zadaná)
            if i == day_idx and emotions_for_days[i]:  # Aktuálny deň + emócia
                symbol = SYMBOLS.get(emotions_for_days[i], "🌀")
                draw.text((x0 + 50, 50), symbol, fill="black", anchor="mm", font_size=30)
        
        frames.append(img)
    
    # Uloženie GIFu
    frames[0].save("week_summary.gif", save_all=True, append_images=frames[1:], duration=1000, loop=0)

# Príklad použitia: emotions_for_days = ["radost", "smutok", None, "hnev", None, None, "pokoj"]
# create_linear_gif(emotions_for_days)