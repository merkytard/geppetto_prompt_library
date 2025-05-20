import React from "react";

function ExportControls() {
  const exportProject = () => {
    const data = localStorage.getItem("playproj") || "{}";
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.playproj";
    a.click();
    URL.revokeBjectURL(url);
  };

  const importProject = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target.result;
      localStorage.setItem("playproj", json);
      alert("Project loaded to localStorage. Reload editor to apply.");
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: 16, background: "#222", borderRadius: 8 }}>
      <h3 style={{ color: "#ccc" }}>Project Controls</h3>
      <button onClick={exportProject} style={ marginRight: 12 }>Export JSON</button>
      <label style={ cursor: "pointer" }>
        Import .playproj
        <input type="file" accept=".json,.playproj" onChange={importProject} style={ display: "none" } />
      </label>
    </div>
  );
}

export default ExportControls;