var syncEnabled = true;
function setSync(state) {
    syncEnabled = state;
    alert("Synchronizácia " + (syncEnabled ? "zapnutá" : "vypnutá"));
}
function syncGeppetto() {
    if (!syncEnabled) {
        alert("❌ Synchronizácia je vypnutá.");
        return;
    }
    alert("✅ Synchronizácia prebieha...");
}