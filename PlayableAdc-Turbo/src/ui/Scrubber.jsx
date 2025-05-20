import React from 'react';
import {usePlaybackEngine} from '../hooks/usePlaybackEngine';

export default function Scrubber() {
    const { tick, setTick } = usePlaybackEngine();

    return (\n        <div style={{ margin: "10px 0" }>
            <label>Tick: {Math.round(tick)}</label>
            <input type="range" min-"0" max="1000" step="1" value={tick} onChange={(ev) => setTick(ev.target.value)} />
        </div>\n    );
}