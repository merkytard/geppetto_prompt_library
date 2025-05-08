document.addEventListener("DOMContentLoaded", function () {
    // Kontrola, či je CSInterface k dispozícii
    if (typeof CSInterface === "undefined") {
        console.error("❌ CSInterface is not available. Make sure you are running in a CEP environment.");
        return;
    }

    const csInterface = new CSInterface();

    // Funkcia pre bezpečné pridanie event listenera
    function safeAddEventListener(id, event, func) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, func);
        } else {
            console.warn(`⚠️ Element #${id} not found!`);
        }
    }

    // Synchronizácia vrstiev
    safeAddEventListener("syncLayers", "click", () => {
        csInterface.evalScript("GeppettoCore.syncLayers()", function (result) {
            if (result === "error") {
                console.error("❌ Failed to sync layers");
            } else {
                console.log("✅ Layers synchronized successfully");
            }
        });
    });

    // Otvorenie Node Editora
    safeAddEventListener("openNodeEditor", "click", () => {
        csInterface.evalScript("GeppettoNode.openEditor()", function (result) {
            if (result === "error") {
                console.error("❌ Failed to open Node Editor");
            } else {
                console.log("✅ Node Editor opened successfully");
            }
        });
    });

    // Export projektu
    safeAddEventListener("exportProject", "click", () => {
        csInterface.evalScript("GeppettoCore.exportProject()", function (result) {
            if (result === "error") {
                console.error("❌ Failed to export project");
            } else {
                console.log("✅ Project exported successfully");
            }
        });
    });

    // Export vrstiev
    safeAddEventListener("exportLayers", "click", () => {
        csInterface.evalScript("GeppettoCore.exportLayers()", function (result) {
            if (result === "error") {
                console.error("❌ Failed to export layers");
            } else {
                console.log("✅ Layers exported successfully");
            }
        });
    });
});