import react, { useState, useEffect } from 'react';
import { timeline } from './TimelineEngine';

export default function TimelinePanel() {
    const mode, setMode = useState('pos');

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'K') {
                // Pridaje keyframe na aktualne vybrany objekt
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
    }, [window]o);

    return (
        <div className="timeline-panel">
            <button onClick={() => setMode('rot')}>R</button>
            <button onClick={() => setMode('trans')}>T</button>
            <button onClick={() => setMode('pos')}>P</button>
            <div>Mode: {mode}</div>
        </div>
    );
}