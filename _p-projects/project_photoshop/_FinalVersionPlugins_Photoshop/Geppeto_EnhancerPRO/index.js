const storage = require("uxp").storage.localFileSystem;
let savedPreset = null;

document.getElementById("apply").addEventListener("click", async () => {
    await applyEnhancements(false);
});

document.getElementById("applyAll").addEventListener("click", async () => {
    await applyEnhancements(true);
});

document.getElementById("reset").addEventListener("click", () => {
    setSliders(0, 0, 0, 0);
});

document.getElementById("savePreset").addEventListener("click", async () => {
    const preset = JSON.stringify(getSliderValues());
    const file = await storage.getFileForSaving("preset.json");
    await file.write(preset);
    alert("Preset uložený ako súbor!");
});

document.getElementById("loadPreset").addEventListener("click", async () => {
    const file = await storage.getFileForOpening();
    const content = await file.read();
    setSliders(...Object.values(JSON.parse(content)));
    alert("Preset načítaný!");
});

document.getElementById("toggleTheme").addEventListener("click", () => {
    const currentTheme = document.body.style.getPropertyValue("--bg-color");
    if (currentTheme === "#222") {
        document.body.style.setProperty("--bg-color", "#fff");
        document.body.style.setProperty("--text-color", "#000");
    } else {
        document.body.style.setProperty("--bg-color", "#222");
        document.body.style.setProperty("--text-color", "#fff");
    }
});

document.getElementById("toggleTheme").addEventListener("click", () => {
    const root = document.documentElement;
    const currentBg = getComputedStyle(root).getPropertyValue("--bg-color").trim();

    if (currentBg === "#2D2D2D") {  
        root.style.setProperty("--bg-color", "#F0F0F0");
        root.style.setProperty("--text-color", "#222");
        root.style.setProperty("--button-color", "#D0D0D0");
        root.style.setProperty("--button-hover", "#008CBA");
        root.style.setProperty("--slider-track", "#C0C0C0");
        root.style.setProperty("--slider-thumb", "#007ACC");
    } else {  
        root.style.setProperty("--bg-color", "#2D2D2D");
        root.style.setProperty("--text-color", "#FFFFFF");
        root.style.setProperty("--button-color", "#3E3E3E");
        root.style.setProperty("--button-hover", "#4A90E2");
        root.style.setProperty("--slider-track", "#4A4A4A");
        root.style.setProperty("--slider-thumb", "#FFCC00");
    }
});

async function applyEnhancements(allLayers) {
    const batchPlay = require("photoshop").action.batchPlay;
    const sliders = getSliderValues();

    let commands = [
        {
            "_obj": "brightnessEvent",
            "brightness": { "_unit": "percentUnit", "_value": sliders.brightness },
            "contrast": { "_unit": "percentUnit", "_value": sliders.contrast },
            "_isCommand": true
        },
        {
            "_obj": "hueSaturation",
            "adjustment": [
                {
                    "_obj": "hueSatAdjustmentV2",
                    "saturation": { "_unit": "percentUnit", "_value": sliders.saturation }
                }
            ],
            "_isCommand": true
        }
    ];

    if (allLayers) {
        let layers = require("photoshop").app.activeDocument.layers;
        for (let layer of layers) {
            await batchPlay(commands, { "modalBehavior": "execute" });
        }
    } else {
        await batchPlay(commands, { "modalBehavior": "execute" });
    }

    alert("Úpravy aplikované!");
}

function getSliderValues() {
    return {
        brightness: parseInt(document.getElementById("brightness").value),
        contrast: parseInt(document.getElementById("contrast").value),
        intensity: parseInt(document.getElementById("intensity").value),
        saturation: parseInt(document.getElementById("saturation").value)
    };
}

function setSliders(b, c, i, s) {
    document.getElementById("brightness").value = b;
    document.getElementById("contrast").value = c;
    document.getElementById("intensity").value = i;
    document.getElementById("saturation").value = s;
    document.getElementById("brightnessValue").innerText = b;
    document.getElementById("contrastValue").innerText = c;
    document.getElementById("intensityValue").innerText = i;
    document.getElementById("saturationValue").innerText = s;
}
