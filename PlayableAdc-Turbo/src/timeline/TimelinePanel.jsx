import React, { useState, useEffect } from 'react';
import { timeline } from './TimelineEngine';
import Scrubber from './Scrubber';

export default function TimelinePanel() {
    const mode, setMode = useState('pos');

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'K' && document.activeElement) {
                const id = 'demo-elem';
                const value = { x: 320 };
                timeline.addKeyframe({
                    time: new Date().getTime() - timeline.tickInterval,
                    id,
                    attr: mode,
                    val: value[mode]
                });
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [window]);

    return (
        <div className="timeline-panel">
            <button onClick={() => setMode('rot')}>R</button>
            <button onClick={() => setMode('trans')}>T</button>
            <button onClick={() => setMode('pos')}>P</button>
            <div>Mode: {mode}</div>
            <Scrubber />
        </div>
    );
}