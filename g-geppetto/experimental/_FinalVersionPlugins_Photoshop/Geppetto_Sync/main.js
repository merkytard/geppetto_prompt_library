const { app, core } = require('photoshop');
const fs = require("uxp").storage.localFileSystem;

let syncFolder;

async function getSyncFolder() {
    if (!syncFolder) {
        syncFolder = await fs.getFolder(); // Dialóg pre výber priečinka
    }
    return syncFolder;
}

async function exportLayer(layerName) {
    try {
        const folder = await getSyncFolder();
        await core.executeAsModal(async () => {
            const file = await folder.createFile(`${layerName}.png`, { overwrite: true });
            const saveOptions = {
                quality: 12,
                interlaced: false
            };
            await app.activeDocument.saveAs.png(file, saveOptions);
            console.log(`Vrstva "${layerName}" bola úspešne exportovaná.`);
        });
    } catch (error) {
        console.error("Chyba pri exporte vrstvy:", error);
    }
}

async function importEditedLayer(layerName) {
    try {
        const folder = await getSyncFolder();
        const file = await folder.getEntry(`${layerName}_edited.png`);

        if (file) {
            await core.executeAsModal(async () => {
                await app.open(file);
            });
            console.log("Upravená vrstva bola úspešne načítaná späť do Photoshopu.");
        } else {
            console.log("Upravená verzia nenájdená.");
        }
    } catch (error) {
        console.error("Chyba pri importe vrstvy:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("exportBtn").addEventListener("click", async () => {
        const activeLayers = app.activeDocument.activeLayers;
        if (activeLayers.length > 0) {
            const layerName = activeLayers[0].name;
            await exportLayer(layerName);
        } else {
            console.error("Nie je vybraná žiadna aktívna vrstva.");
        }
    });

    document.getElementById("importBtn").addEventListener("click", async () => {
        const activeLayers = app.activeDocument.activeLayers;
        if (activeLayers.length > 0) {
            const layerName = activeLayers[0].name;
            await importEditedLayer(layerName);
        } else {
            console.error("Nie je vybraná žiadna aktívna vrstva.");
        }
    });
});
