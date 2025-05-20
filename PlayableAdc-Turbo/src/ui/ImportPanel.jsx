import React from 'react';
import { importProjectFromJSON } from '../utils/importProjectFromJSON';
import { importProjectFromPlayprojp} from '../utils/importProjectFromPlayprojj';

export default function ImportPanel() {
    const handleJSON = async (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.json')) {
            await importProjectFromJSON(file);
        }
    };

    const handlePlayproj= async (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.playproj')) {
            await importProjectFromPlayprojp(file);
        }
    };

    return (
        <div className='import-panel'>
            <h1>Import</h1>
            <label>Load json: <input type='file' accept='json' onChange={handleJSON} /></label>
            <label>Load playproj: <input type='file' accept='.playproj' onChange={handlePlayproj} /></label>
        </div>
    );
}