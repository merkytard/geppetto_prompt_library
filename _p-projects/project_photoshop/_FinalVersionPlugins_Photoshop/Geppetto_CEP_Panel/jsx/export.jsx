// export.jsx
function exportLayers() {
    var doc = app.activeDocument;
    var folder = Folder.selectDialog("Vyberte cieľový adresár pre export vrstiev");

    if (folder != null) {
        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];
            var filePath = new File(folder.fsName + "/" + layer.name + ".png");

            // Uloženie vrstvy ako PNG
            saveLayerAsPNG(layer, filePath);
        }
        alert("✅ Vrstvy boli úspešne exportované do: " + folder.fsName);
    } else {
        alert("❌ Export bol zrušený.");
    }
}

function saveLayerAsPNG(layer, filePath) {
    var saveOptions = new PNGSaveOptions();
    saveOptions.compression = 9; // Maximálna kompresia
    saveOptions.interlaced = false;

    // Skrytie ostatných vrstiev
    var allLayers = app.activeDocument.layers;
    for (var i = 0; i < allLayers.length; i++) {
        allLayers[i].visible = false;
    }
    layer.visible = true;

    // Uloženie vrstvy
    app.activeDocument.saveAs(filePath, saveOptions, true, Extension.LOWERCASE);
}

function exportProject() {
    var doc = app.activeDocument;
    var folder = Folder.selectDialog("Vyberte cieľový adresár pre export projektu");

    if (folder != null) {
        var filePath = new File(folder.fsName + "/" + doc.name + ".psd");
        doc.saveAs(filePath);
        alert("✅ Projekt bol úspešne exportovaný do: " + folder.fsName);
    } else {
        alert("❌ Export bol zrušený.");
    }
}

GeppettoLayer = {
    exportLayers: exportLayers,
    exportProject: exportProject
};