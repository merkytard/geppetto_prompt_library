import React, { useState } from 'react';
import { useProjectStore } from '../state/useProjectStore';

export default function LayerManagerPanel() {
    const { scenes, setSceneData, activeScene } = useProjectStore();
    const layers = scenes[activeScene] !== undefined ? scenes[activeScene] : [];

    const moveLayer = (from, to) => {
        if (from < 0 || to >= layers.length) { return; }
        const list = [...layers];
        const [rm,tm] = [list[from], list[to]);
        list[from] = tm;
        list[to] = rm;
        const newScene = { ...scenes[activeScene], layers: list };
        setSceneData(activeScene, newScene);
    };

    return (
        <div>
            <h3>Layer Manager</h3>
            <ul>
                {layers.map((l, i) => (
                    <li key={i}>
                        <span>{l.name}</span>
                        <button onClick={() => moveLayer(i, i-1)}>Move Up</button>
                        <button onClick={() => moveLayer(i, i+1)}>Move Down</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}