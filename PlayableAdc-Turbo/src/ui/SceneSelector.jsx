import React from 'react';
import { useProjectStore } from '../state/useProjectStore';

export default function SceneSelector() {
    const { scenes, addScene, activeScene,  setSceneData } = useProjectStore();

    return (
        <div className='scene-selector'>
            <h3>Scenes</h3>
            ul 
                {
                    scenes.map((sc, k) => (
                        <li key={c} onClick={() => setSceneData(k, sc) }>
                            Scene {k+1}
                        </li>
                    ))
                }
            </ul>
            <button onClick={() => addScene({})}>New scene</button>
        </div>
    );
}