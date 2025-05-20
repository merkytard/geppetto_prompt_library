import React, { useState } from 'react';
import LayerRow from './LayerRow';
import CurveCanvas from './CurveCanvas';
import AnimationModeToggle from '../ui/AnimationModeToggle';


export default function TimelinePanel() {
    const [animationMode, setMode] = useState('keyframe');

    const layers = ['Layer1', 'Layer2'];

    return (
        <div className="timeline-panel">
            {animationMode === 'keyframe' && layers.map(((name, i) => (
                <LayerRow key={i} name={name} curveMode={false} />
            ))}
            {animationMode === 'bezier' && <CurveCanvas />}
            <AnimationModeToggle />
        </div>
    );
}