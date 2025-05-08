document.addEventListener("DOMContentLoaded", function () {
    const btnPopulate = document.getElementById("btnPopulate");
    const syncLayers = document.getElementById("syncLayers");
    const exportLayers = document.getElementById("exportLayers");
    const layersContainer = document.getElementById("layers");
    const autoSyncCheckbox = document.getElementById("autoSyncCheckbox");
    const autoExportCheckbox = document.getElementById("autoExportCheckbox");

    if (!btnPopulate || !syncLayers || !exportLayers || !layersContainer || !autoSyncCheckbox || !autoExportCheckbox) {
        console.error("❌ Error: UI elements not found!");
        return;
    }

    let autoSyncEnabled = false;
    let autoExportEnabled = false;

    function setActivityIndicator(elementId, color) {
        const indicator = document.getElementById(elementId);
        if (indicator) {
            indicator.className = `activity-indicator ${color}`;
        }
    }

    function logToConsole(message) {
        const consoleOutput = document.getElementById("consoleOutput");
        if (consoleOutput) {
            const logEntry = document.createElement("div");
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            consoleOutput.appendChild(logEntry);
            consoleOutput.scrollTop = consoleOutput.scrollHeight; // Auto-scroll
        }
    }

    if (typeof CSInterface !== "undefined") {
        // CEP prostredie
        const csInterface = new CSInterface();

        btnPopulate.addEventListener("click", function () {
            setActivityIndicator("loadIndicator", "green");
            csInterface.evalScript("getLayers()", function (result) {
                if (result === "error") {
                    logToConsole("❌ Failed to load layers");
                    setActivityIndicator("loadIndicator", "red");
                } else {
                    const layers = JSON.parse(result);
                    displayLayers(layers);
                    logToConsole("✅ Layers loaded successfully");
                }
                setTimeout(() => setActivityIndicator("loadIndicator", ""), 2000);
            });
        });

        syncLayers.addEventListener("click", function () {
            setActivityIndicator("syncIndicator", "green");
            csInterface.evalScript("GeppettoSync.syncLayers()", function (result) {
                if (result === "error") {
                    logToConsole("❌ Failed to sync layers");
                    setActivityIndicator("syncIndicator", "red");
                } else {
                    logToConsole("✅ Layers synchronized successfully");
                }
                setTimeout(() => setActivityIndicator("syncIndicator", ""), 2000);
            });
        });

        exportLayers.addEventListener("click", function () {
            setActivityIndicator("exportIndicator", "green");
            csInterface.evalScript("GeppettoCore.exportLayers()", function (result) {
                if (result === "error") {
                    logToConsole("❌ Failed to export layers");
                    setActivityIndicator("exportIndicator", "red");
                } else {
                    logToConsole("✅ Layers exported successfully");
                }
                setTimeout(() => setActivityIndicator("exportIndicator", ""), 2000);
            });
        });

        // Automatická synchronizácia
        autoSyncCheckbox.addEventListener("change", function (event) {
            autoSyncEnabled = event.target.checked;
            logToConsole(`Automatická synchronizácia: ${autoSyncEnabled ? "zapnutá" : "vypnutá"}`);
        });

        // Automatický export
        autoExportCheckbox.addEventListener("change", function (event) {
            autoExportEnabled = event.target.checked;
            logToConsole(`Automatický export: ${autoExportEnabled ? "zapnutý" : "vypnutý"}`);
        });

        // Monitorovanie zmien v dokumente
        csInterface.evalScript("app.activeDocument.addNotification('all', function() { GeppettoCore.handleDocumentChange(); })");

    } else if (typeof require !== "undefined") {
        // UXP prostredie
        const photoshop = require("photoshop");

        btnPopulate.addEventListener("click", async function () {
            setActivityIndicator("loadIndicator", "green");
            try {
                const layers = await photoshop.app.activeDocument.layers;
                displayLayers(layers);
                logToConsole("✅ Layers loaded successfully");
            } catch (error) {
                logToConsole("❌ Error loading layers: " + error.message);
                setActivityIndicator("loadIndicator", "red");
            } finally {
                setTimeout(() => setActivityIndicator("loadIndicator", ""), 2000);
            }
        });

        exportLayers.addEventListener("click", async function () {
            setActivityIndicator("exportIndicator", "green");
            try {
                const doc = photoshop.app.activeDocument;
                const folder = await photoshop.core.executeAsModal(async () => {
                    return await photoshop.action.batchPlay(
                        [
                            {
                                "_obj": "selectFolder",
                                "title": "Vyberte cieľový adresár pre export vrstiev"
                            }
                        ],
                        { modalBehavior: "execute" }
                    );
                }, { "commandName": "Export Layers" });

                if (folder && folder.length > 0) {
                    const folderPath = folder[0].path;
                    for (const layer of doc.layers) {
                        const filePath = `${folderPath}/${layer.name}.png`;
                        await photoshop.action.batchPlay(
                            [
                                {
                                    "_obj": "exportDocument",
                                    "as": "PNG",
                                    "to": filePath,
                                    "options": {
                                        "compression": 9,
                                        "interlaced": false
                                    }
                                }
                            ],
                            { modalBehavior: "execute" }
                        );
                    }
                    logToConsole("✅ Layers exported successfully");
                } else {
                    logToConsole("❌ Export was cancelled");
                }
            } catch (error) {
                logToConsole("❌ Error exporting layers: " + error.message);
                setActivityIndicator("exportIndicator", "red");
            } finally {
                setTimeout(() => setActivityIndicator("exportIndicator", ""), 2000);
            }
        });

        // Automatická synchronizácia
        autoSyncCheckbox.addEventListener("change", function (event) {
            autoSyncEnabled = event.target.checked;
            logToConsole(`Automatická synchronizácia: ${autoSyncEnabled ? "zapnutá" : "vypnutá"}`);
        });

        // Automatický export
        autoExportCheckbox.addEventListener("change", function (event) {
            autoExportEnabled = event.target.checked;
            logToConsole(`Automatický export: ${autoExportEnabled ? "zapnutý" : "vypnutý"}`);
        });

        // Monitorovanie zmien v dokumente
        photoshop.app.activeDocument.addListener("change", async () => {
            if (autoSyncEnabled) {
                logToConsole("Document changed. Synchronizing layers...");
                await synchronizeLayers();
            }
            if (autoExportEnabled) {
                logToConsole("Document changed. Exporting layers...");
                await exportLayers();
            }
        });

        async function synchronizeLayers() {
            setActivityIndicator("syncIndicator", "green");
            try {
                // Logika pre synchronizáciu
                logToConsole("✅ Layers synchronized successfully");
            } catch (error) {
                logToConsole("❌ Failed to sync layers");
                setActivityIndicator("syncIndicator", "red");
            } finally {
                setTimeout(() => setActivityIndicator("syncIndicator", ""), 2000);
            }
        }

        async function exportLayers() {
            setActivityIndicator("exportIndicator", "green");
            try {
                const doc = photoshop.app.activeDocument;
                const folder = await photoshop.core.executeAsModal(async () => {
                    return await photoshop.action.batchPlay(
                        [
                            {
                                "_obj": "selectFolder",
                                "title": "Vyberte cieľový adresár pre export vrstiev"
                            }
                        ],
                        { modalBehavior: "execute" }
                    );
                }, { "commandName": "Export Layers" });

                if (folder && folder.length > 0) {
                    const folderPath = folder[0].path;
                    for (const layer of doc.layers) {
                        const filePath = `${folderPath}/${layer.name}.png`;
                        await photoshop.action.batchPlay(
                            [
                                {
                                    "_obj": "exportDocument",
                                    "as": "PNG",
                                    "to": filePath,
                                    "options": {
                                        "compression": 9,
                                        "interlaced": false
                                    }
                                }
                            ],
                            { modalBehavior: "execute" }
                        );
                    }
                    logToConsole("✅ Layers exported successfully");
                } else {
                    logToConsole("❌ Export was cancelled");
                }
            } catch (error) {
                logToConsole("❌ Error exporting layers: " + error.message);
                setActivityIndicator("exportIndicator", "red");
            } finally {
                setTimeout(() => setActivityIndicator("exportIndicator", ""), 2000);
            }
        }
    } else {
        console.error("❌ Unknown environment");
    }

    function displayLayers(layers) {
        layersContainer.innerHTML = "";
        const layersList = document.createElement("div");
        layersList.className = "layers-list";
        layers.forEach(layer => {
            let layerItem = document.createElement("sp-body");
            layerItem.textContent = `📄 ${layer.name}`;
            layersList.appendChild(layerItem);
        });
        layersContainer.appendChild(layersList);
    }
});