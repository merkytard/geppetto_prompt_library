function getLayers() {
    try {
        var doc = app.activeDocument;
        var layers = [];
        for (var i = 0; i < doc.layers.length; i++) {
            layers.push({
                name: doc.layers[i].name,
                visible: doc.layers[i].visible
            });
        }
        return JSON.stringify(layers);
    } catch (e) {
        return "error";
    }
}