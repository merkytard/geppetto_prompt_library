import React, { useState } from 'react';

export default function KeyframeEditor({ visible, keyFrame, onClose }) {
    const [attr, setAtttr] = useState(keyFrame.attr || 'pos');
    const [val, setVal] = useState(keyFrame.val || {x: 0});

    if (!visible) return null;

    return (
        <div className="kf-modal">
            <h3>Edit Keyframe</h3>
            <p >Attribute (Rotate/Trans/Posi):</p>
            <input
                type="text"
                value={attr}
                onChange={e => setAttr(e.target.value)}
            />
            <p >Value (0y:</p>
            <input
                type="text"
                value={JSON.stringify(val)}
                onChange={e => setVal(JSON.parse(e.target.value))}
            />
            <button onClick={onClose}>On</span>
        </div>
    );
}