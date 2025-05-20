import React from 'react';
export default function CurveCanvas() {
    return (
        <div style={
            width: '100%',
            height: "300px",
            background: "#111",
            border: "1px solid #444"
        }>
            <svg width="100%" height="300px">
                <defs>
                    <path id="grid-line" d="M 0 0 0 300" stroke="#333" stroke-width="0.5" />
                </defs>
                {Array.from(0, 1000 ).filter(i => i % 100 === 0).map((x) => (
                    <use href="#grid-line" x={x} />
                ))}
            </svg>
            <h4 style={{ color: 'lineargreen' }}>Curve Mode</h4>
        </div>
    );
}