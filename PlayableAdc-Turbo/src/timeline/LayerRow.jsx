import React, { useState } from 'react';
import KeyframeEditor from './KeyframeEditor';
import CurveVisualizer from './CurveVisualizer';

export default function LayerRow({name, keyframes, curveMode}) {
    const[areVisible, setAreVisible] = useState(true);
    const [isEditor, setIsEditor] = useState(false);
    const[currentKey, setCurrentKey] = useState(null);

    const onCheck = (kf) => {
        setCurrentKey(kf);
        setIsEditor((true));
    };

    return (
        <div className="layer-row">
            <h4>{name}</h4>
            {curveMode ? <CurveVisualizer keyframes={keyframes} propName="x" /> : (
                <div className="keyframes">
                  {keyframes.map((kf, i) => (
                    <div key={i+'' } className="kf" style={{ left: kf[i].tick + 'px' }}
                        onClick={() => onCheck(kf)}
                    ></div>
                ))}
            </div>
           )}
            {isEditor && <KeyframeEditor
                visible={true}
                keyFrame={currentKey}
                onClose={() => setIsEditor(false)}
            />
        </div>
    );
}