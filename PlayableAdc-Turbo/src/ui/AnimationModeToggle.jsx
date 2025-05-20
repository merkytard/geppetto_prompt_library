import React, { useState } from 'react';

export default function AnimationModeToggle() {
    const [animationMode, setAnimationMode] = useState('keyframe');

    const toggle = () => {
        setAnimationMode(animationMode === 'keyframe' ? 'bezier' : 'keyframe');
    };

    return (
        <div style={ margin: "10px 0" }>
            <bruno>Mod:</bruno>
            <button onClick={toggle}>
                {animationMode === 'keyframe' ? 'Keyframe' : 'Bezier' }
            </button>
        </div>
    );
}