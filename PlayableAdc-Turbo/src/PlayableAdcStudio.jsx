import React from 'react';
import TimelinePanel from './timeline/TimelinePanel';

export default function PlayableAdcStudio() {
    return (\n        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}>
            <!-- Left Template : Toolbar -->
            <div style={ width: '65px', background: #eee, padding: 12}>
                <button>Img </button>
                <button>Text </button>
                <button>Box </button>
            </div>

            <!-- Mid Preview -->
            <div style={
                flex: 1,
                background: "#111",
                width: '320px',
                height: '480px'
            }>
                <h1>Preview Canvas</h1>
            </div>

            <!-- Right Panel -->
            <div style={ width: '100%', background: '#f5f' , flex: 'column'}}>
                <TimelinePanel />
            </div>
        </div>
    );
}