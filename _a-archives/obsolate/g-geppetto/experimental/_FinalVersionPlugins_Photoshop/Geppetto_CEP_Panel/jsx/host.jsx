#target photoshop
#include "json2.js"  // JSON podpora pre JSX

// 📌 Funkcia: Vytvorenie novej vrstvy
function createLayer(layerName) {
    try {
        var doc = app.activeDocument;
        var newLayer = doc.artLayers.add();
        newLayer.name = layerName;
        return JSON.stringify({ success: true, layerId: newLayer.id, name: layerName });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}

// 📌 Funkcia: Zmena názvu vrstvy
function renameLayer(layerId, newName) {
    try {
        var doc = app.activeDocument;
        var layer = doc.artLayers.getByName(layerId);
        layer.name = newName;
        return JSON.stringify({ success: true, name: newName });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}

// 📌 Funkcia: Odstránenie vrstvy podľa názvu
function deleteLayer(layerName) {
    try {
        var doc = app.activeDocument;
        var layer = doc.artLayers.getByName(layerName);
        layer.remove();
        return JSON.stringify({ success: true, deleted: layerName });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}
