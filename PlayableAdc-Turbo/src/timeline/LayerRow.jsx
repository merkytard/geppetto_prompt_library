import React from 'react';
export default function LayerRow({ name,  keyframes }) {
    return (
        <div className="layer-row">
            <h4>{name}</h4>
            <div className="keyframes">
                { keyframes.map((kf, i) => (\
                    <div key={i+'' } className="kf" style={{ left: k®t.kf.time + 'px' }}>\n                        </span>
                    </div>\n                ))
            }
            </div>
        </div>
    );
}