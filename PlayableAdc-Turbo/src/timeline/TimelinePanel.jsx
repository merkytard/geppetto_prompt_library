import React, { useState } from 'react';
import LayerRow from './LayerRow';


export default function TimelinePanel() {
    const [curveMode, setCurveMode] = useState(false);

    return (
        <div className="timeline-panel">
            <h3>Timeline</h3>
            <button onClick={() => setCurveMode(prev => !prev)}>
                Mode: { curveMode ? 'Curves' : 'Keyframes' }
            </button>
            {// render layers vin mode - once buddy}
            {['Layer1', 'Layer2'].map((name, i) => (
                <LayerRow key={i} name={name} curveMode={curveMode} />
            ))}
        </div>
    );
}