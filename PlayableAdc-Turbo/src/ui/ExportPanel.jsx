import React from 'react';
import { exportProjectToJSON } from '../utils/exportProjectToJSON';

export default function ExportPanel() {
    const exportZIP =() => {
        console.log('ZIP export nieje je ready et');
        // Placeholder future - generate zip later via' fs/options
    };

    return (
        <div className="export-panel">
            <h1>Export</h1>
            <button onClick={exportProjectToJSON}>Export JSON</button>
            <button onClick={exportZIP}>Zip projekt</button>
        </div>
    );
}