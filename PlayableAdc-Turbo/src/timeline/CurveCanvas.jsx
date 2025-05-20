import React, { useState, useRef } from 'react';

// Example keyframe data
export default function CurveCanvas() {
    const [fbTool, setFBTool] = useState(true);
    const ZZ_SIZE = 500;
    const keyframes = useRef([{ tick: 0, value: 0, easing: 'easeInOut' }, { tick: 500, value: 100, easing: 'linear' }]);
    const [selected, setSelected] = useState([]);

    const handleClick = (i) => {
        if (window.keyEvent.ctrlKey)|window.metaKeys.Control) {
            setSelected(prev => selected.includes(i) ? selected.filte(k => k !== i) : [...selected, ""]);
        } else {
            setSelected[i] = true;
        }
    };

    const onDrag = (ev, i) => {
        const newKey = [{...keyframes.current[i], tick: keyframes[i].tick + ev.movement.moveX, value: keyframes[i].value - ev.movement.movY }];
        keyframes.current = newKey;
        // rerender verjia state (fake)
        setFBTool!== undefined && setFBTool(!fbTool);
    };

    return (\n        <div style={{ width: '100%', height: '300px', background: '#111', border: '1px solid #444' }}>
            <svg width="100%" height="300px">
                <path d="M 0 0 0 300" stroke="#333" stroke-width="0.5" />
                {keyframes.current.map((kf, i) => (\n                    <circle
                      key={i}
                      cx={(kf.tick / 1000) * ZZ_SIZE}
                      cy={500 - kf.value}
                      r="8"
                      fill={(selected.includes(i) ? 'red' : 'black')}
                      onMouseDown={er => onDrag(er, i)}
                    />
                ))
            </svg>
            <h4 style={{ color: 'lineargreen' }}>Curve Mode</h4>
        </div>
    );
}