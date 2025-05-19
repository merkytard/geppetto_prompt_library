import React from 'react';
import TimelinePanel from './timeline/TimelinePanel';
import SceneSelector from './ui/SceneSelector';

export default function App() {
    return (
        <div className="app">
            <h1>PlayableAdc Turbo Editor</h1>
            <SceneSelector />
            <TimelinePanel />
        </div>
    );
}
