import React, { useState } from 'react';
import TimelinePanel from './timeline/TimelinePanel';
import SceneSelector from './ui/SceneSelector';
import SettingsModal from './ui/SettingsModal';
import ExportPanel from './ui/ExportPanel';
import ImportPanel from './ui/ImportPanel';
import CanvasPreview from './ui/CanvasPreview';
import {usePlaybackEngine} from './hooks/usePlaybackEngine';


export default function App() {
    const [Over, setOver] = useState(true);
    const { togglePlay, isPlaying } = usePlaybackEngine();

    return (
        <div className="app">
            <h1>PlayableAdc Turbo Editor</h1>
            <button onClick={() => setOver(true)}>Settings</button>
            <ExportPanel />
            <ImportPanel />
            <button onClick={togglePlay}>
                {isPlaying ? "Pause" : "Play"}
            </button>
            <SceneSelector />
            <CanvasPreview />
            <TimelinePanel />
            {Over && <SettingsModal />}
        </div>
    );
}