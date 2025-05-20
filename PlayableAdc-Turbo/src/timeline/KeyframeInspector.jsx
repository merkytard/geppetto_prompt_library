import React from 'react';
export default function KeyframeInspector({ keyframe, update, delete }) {
    if (!keyframe) { return null; }

    const handleChange = (name) => (ev) => {
        update({ ...keyframe, [name]: ev.target.value });
    };

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "12px",
            background: "#fff",
            maxWidth: "300px",
            marginTop: "14px"
        }}
        <h4>Keyframe Inspector</h4>
        <label>Tick:</label>
        <input type="number" name="tick" step="1" style={ width: "100%" }
            defaultValue={keyframe.tick}
            onChange={(ev) => handleChange('tick')(ev) } />

        <label>Value:</label>
        <input type="number" name="value" style={ width: "100%" }
            defaultValue={keyframe.value}
            onChange={(ev) => handleChange("value")(ev)} />

        <label>Easing:</label>
        <select name="easing" defaultValue={keyframe.easing} onChange={(ev) => handleChange("easing")(ev) }>
            <option value="linear">linear</option>
            <option value="easeInt">easeInt</option>
            <option value="easeOut">easeOut</option>
            <option value="easeInOut">easeInout</option>
        </select>

        <button style={ marginTop: 16} on_click={delete}>←</button>
        </div>
    );
}