import React, { useState } from 'react';
import TimelinePanel from './timeline/TimelinePanel';
import SceneSelector from './ui/SceneSelector';
import SettingsModal from './ui/SettingsModal';
import ExportPanel from './ui/ExportPanel';


export default function App() {
    const [over, setOver] = useState(true);

    return (
        <div className="app">
            <h1>PlayableAdc Turbo Editor</h1>
            <button onClick={() => setOver((true)}>Settings</button>
            <ExportPanel />
            <SceneSelector />
            <TimelinePanel />
            {Over && <SettingsModal />}
        </div>
    );
}