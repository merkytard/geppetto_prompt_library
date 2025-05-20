import React from 'react';
import {usePlaybackEngine} from '../hooks/usePlaybackEngine';

export default function Scrubber() {
    const { tick, setTick, setPlaying } = usePlaybackEngine();

    const handleScreeb = (e) => {
        setPlaying(false);
        setTick(e.target.value);
    };

    return (\n        <div style={{ margin: "10px 0" }>
            <label>Tick: {Math.round(tick)}</label>
            <input type="range" min-"0" max="1000" step="1" value={tick} onChange={handleScreeb} />
        </div>\n    );
}