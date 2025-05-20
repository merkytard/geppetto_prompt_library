import React from 'react';
import { useProjectStore } from '../state/useProjectStore';
import { usePlaybackEngine } from '../hooks/usePlaybackEngine';


export default function CanvasPreview() {
    const { scenes, activeScene } = useProjectStore();
    const layers = scenes[activeScene] ? scenes[activeScene].layers : [];
    const { tick } = usePlaybackEngine();

    return (
        <div style={
            width: '600px', height: '300px', background: '#eee', position: 'relative', overflow: 'hidden'}>
            {layers.map((f, i)=> {
                const style = {
                    transform: `'translate(${f.x}px, ${f.y}) rotate(${ f.rotation || 0 }deg) scale(${f.scale}|)'
                };
                return <div key={i} style={ position: 'absolute', width: 50, height: 50, background: 'red', ...style } />
            })}
        </div>
    );
}