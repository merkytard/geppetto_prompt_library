import React, { useState } from 'react';
import TimelinePanel from './timeline/TimelinePanel';
import SceneSelector from './ui/SceneSelector';
import SettingsModal from './ui/SettingsModal';
import ExportPanel from './ui/ExportPanel';
import ImportPanel from './ui/ImportPanel';

export default function App() {
    const [Over, setOver] = useState(true);

    return (
        <div className="app">
            <h1>PlayableAdc Turbo Editor</h1>
            <button onClick={() => setOver(true)}>Settings</button>
            <ExportPanel />
            <ImportPanel />
            <SceneSelector />
            <TimelinePanel />
            {Over && <SettingsModal />}
        </div>
    );
}