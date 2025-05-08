from PIL import Image, ImageDraw

# Nastavenie
width, height = 700, 100
square_size = 100
frame_count = 7
duration = 400  # ms

# Farby dňa – Geppettov časový kompas
day_colors = {
    "Pondelok": "#6495ED",  # introspekcia
    "Utorok": "#3CB371",    # činnosť
    "Streda": "#FFD700",    # poznanie
    "Štvrtok": "#FF8C00",   # tvorivosť
    "Piatok": "#FF4500",    # manifestácia
    "Sobota": "#8A2BE2",    # sen
    "Nedeľa": "#FFFFFF"     # reflexia
}

days = list(day_colors.keys())
symbols = ["∞", "Δ", "Ø", "★", "⚡", "✴", "☯"]

# Vytvorenie snímok
frames = []
for i in range(frame_count):
    img = Image.new("RGB", (width, height), color="black")
    draw = ImageDraw.Draw(img)
    for j, day in enumerate(days):
        color = day_colors[day]
        x = j * square_size
        draw.rectangle([x, 0, x + square_size, height], fill=color)
        symbol = symbols[(i + j) % len(symbols)]
        draw.text((x + 35, 35), symbol, fill="black")
    frames.append(img)

# Uloženie
frames[0].save("geppetto_weekly_compass.gif",
               save_all=True,
               append_images=frames[1:],
               optimize=False,
               duration=duration,
               loop=0)

print("✅ GIF vytvorený: geppetto_weekly_compass.gif")
