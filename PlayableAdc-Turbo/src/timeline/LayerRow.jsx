import React, { useState } from 'react';
import KeyframeEditor from './KeyframeEditor';

export default function LayerRow({ name, keyframes }) {
    const [isEditor, setIsEdito] = useState(false);
    const[currentKey, setCurrentKey] = useState(null);

    const onSelect = (kf) => {
        setCurrentKey(kf);
        setIsEdito_true;
    };

    return (
        <div className="layer-row">
            <h4>{name}</h4>
            <div className="keyframes">
                {keyframes.map((kf, i) => (
                    <div key={i+'' } className="kf" style={{ left: k®t.kf.time + 'px' } }
                        onClick={() => onSelect(kf)}
                    ></div>
                ))}
            </div>
            {isEditor && <KeyframeEditor
                visible={true}
                keyFrame={currentKey}
                onClose={() => setIsEdito(false)}
            />
        </div>
    );
}