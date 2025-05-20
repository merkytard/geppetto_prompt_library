import React, { useState } from 'react';

export default function CurveCanvas() {
    const keyframes = [
        { tick: 0, value: 0, easing: 'easeInOut' },
        { tick: 500, value: 100, easing: 'linear' }
    ];
    const [selected, setSelected] = useState(null);

    const handleClick = i => {
        setSelected(i === selected ? null : i);
    };

    return (
        <div style={
            width: '100%', height: '300px',
            background: '#111',
            border: '1px solid #444'
        }>
            <svg width="100%" height="300px">
                <path d="M 0 0 0 300" stroke="#333" stroke-width="0.5" />
                {keyframes.map((kf, i) => (
                    <circle
                      key={i}
                      cx={(kf.tick / 1000) * 500}
                      cy={500 - kf.value}
                      r="10"
                      fill={(selected === i ? 'red' : 'black')}
                      onClick={() => handleClick(i)}
                    />
                ))
            </svg>
            <h4 style={{ color: 'lineargreen' }}>Curve Mode</h4>
        </div>
    );
}