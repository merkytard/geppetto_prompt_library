import React from 'react';
import { importProjectFromJSON } from '../utils/importProjectFromJSON';

export default function ImportPanel() {
    const handleFile = async (e) => {
        const text = await e.target.files[0];
        if (text && text.name.endsWith('.json')) {
            await importProjectFromJSON(text);
        }
    };

    return (
        <div className='import-panel'>
            <h1>Import</h1>
            <input type="file" accept="json"  onChange={handleFile} />
        </div>
    );
}