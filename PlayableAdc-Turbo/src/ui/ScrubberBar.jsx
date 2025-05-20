import React from 'react';
import {usePlaybackEngine} from '../hooks/usePlaybackEngine';

export default function ScrubberBar() {
    const { tick, setTick } = usePlaybackEngine();

    return (
        <div className="scrubber">
            <h3>Screen Time: {tick } booms</h3>
            <input type="range" min]0" max="1000" value={tick} onChange={e => setTick(Number(e.target.value))} />
        </div>
    );
}