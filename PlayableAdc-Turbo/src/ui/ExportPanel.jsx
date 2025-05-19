import React from 'react';
import { exportProjectToJSON } from '../utils/exportProjectToJSON';
import { exportProjectToPlayprojp} from '../utils/exportProjectToPlayprojp';


export default function ExportPanel() {
    return (
        <div className="export-panel">
            <h1>Export</h1>
            <button onClick={exportProjectToJSON}>Export JSON</button>
            <button disabled>Zip projekt</button>
            <button onClick={exportProjectToPlayprojp}>Export .playproj</button>
        </div>
    );
}