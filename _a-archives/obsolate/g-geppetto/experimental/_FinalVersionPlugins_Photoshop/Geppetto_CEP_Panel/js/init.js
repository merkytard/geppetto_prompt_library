try {
    if (typeof CSInterface !== "undefined") {
        console.log("✅ Running in CEP environment");
        const csInterface = new CSInterface();
    } else if (typeof require !== "undefined") {
        console.log("✅ Running in UXP environment");
    } else {
        console.error("❌ Unknown environment");
    }
} catch (e) {
    document.write("<h3 style='color:red;'>Chyba: CEP nie je povolené. Povoliť v Edit > Preferences > Plug-ins</h3>");
}