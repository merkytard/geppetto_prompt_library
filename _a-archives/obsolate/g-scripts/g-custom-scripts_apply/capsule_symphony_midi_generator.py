
import mido
from mido import Message, MidiFile, MidiTrack

# Mapa glifov na MIDI tóny
glyph_to_note = {
    "●": 60,   # C4
    "↺": 62,   # D
    "✧": 64,   # E
    "☀️": 67,   # G
    "❄️": 59,   # B3
    "✴️": 65,   # F
    "🌕": 72,   # C5
    "⬛": 48    # C3
}

def generate_midi_from_glyph_sequence(glyph_sequence, filename='capsule_output.mid'):
    mid = MidiFile()
    track = MidiTrack()
    mid.tracks.append(track)

    for glyph in glyph_sequence:
        note = glyph_to_note.get(glyph, 60)
        track.append(Message('note_on', note=note, velocity=64, time=0))
        track.append(Message('note_off', note=note, velocity=64, time=480))

    mid.save(filename)
    print(f"MIDI saved as {filename}")

if __name__ == "__main__":
    test_sequence = ['●', '↺', '✧', '☀️', '❄️', '✴️', '🌕', '⬛']
    generate_midi_from_glyph_sequence(test_sequence)
