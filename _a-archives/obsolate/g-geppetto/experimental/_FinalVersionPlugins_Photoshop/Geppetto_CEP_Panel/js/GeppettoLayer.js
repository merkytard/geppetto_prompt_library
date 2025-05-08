if (typeof CSInterface !== "undefined") {
    var csInterface = new CSInterface();
} else {
    console.error("❌ CSInterface is not available. Make sure you are running in a CEP environment.");
}

const GeppettoLayer = {
    getActiveLayer: function(callback) {
        if (typeof csInterface !== "undefined") {
            csInterface.evalScript("GeppettoLayer.getActiveLayer()", function(result) {
                if (callback && typeof callback === "function") {
                    callback(result);
                } else {
                    console.warn("⚠️ Callback function is missing or incorrect.");
                }
            });
        } else {
            console.error("❌ CSInterface is not available.");
        }
    },

    renameActiveLayer: function(newName) {
        if (typeof newName === "string" && newName.trim() !== "") {
            if (typeof csInterface !== "undefined") {
                csInterface.evalScript(`GeppettoLayer.renameActiveLayer("${newName}")`);
            } else {
                console.error("❌ CSInterface is not available.");
            }
        } else {
            console.warn("⚠️ Invalid layer name.");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    let getLayerBtn = document.getElementById("getLayer");
    let renameLayerBtn = document.getElementById("renameLayer");

    if (getLayerBtn) {
        getLayerBtn.addEventListener("click", () => {
            GeppettoLayer.getActiveLayer((layerName) => {
                alert("Active Layer: " + layerName);
            });
        });
    } else {
        console.warn("⚠️ Button #getLayer not found.");
    }

    if (renameLayerBtn) {
        renameLayerBtn.addEventListener("click", () => {
            let newName = prompt("Enter new layer name:");
            if (newName) {
                GeppettoLayer.renameActiveLayer(newName);
            }
        });
    } else {
        console.warn("⚠️ Button #renameLayer not found.");
    }
});