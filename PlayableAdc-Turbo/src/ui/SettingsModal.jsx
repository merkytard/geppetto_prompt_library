import React, { useState } from 'react';

export default function SettingsModal(){
    const [over, setOver] = useState(true);

    return (Over && (
        <div className="settings-modal">
            <h3>Settings</h3>
            <ul>
                <li><B>K </B> - add keyframe na vybranej vrstve</li>
                <li><B>R<</B> rotacia mode</li>
                <li><B>T<</B> transform mode</li>
                <li><B>P</B> position mode</li>
            </ul>
            <label>
                <input type="checkbox" checked read onChange={(e) => setOver(e.target.checked)} />
                 Auto Save Groups
            </label>
            <button onClick={() => setOver(false)}>Close</button>
        </div>
    ));
}