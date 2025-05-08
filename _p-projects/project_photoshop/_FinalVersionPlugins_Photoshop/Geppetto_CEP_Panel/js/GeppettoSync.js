const GeppettoSync = {
    syncLayers: function() {
        console.log("🔄 Synchronizing layers...");
        // Tu by bola logika pre synchronizáciu vrstiev
    },

    exportProject: function() {
        console.log("📤 Exporting project...");
        // Tu by bola logika pre export projektu
    }
};

if (typeof GeppettoCore !== "undefined") {
    GeppettoCore.registerModule("SyncBase", GeppettoSync);
}