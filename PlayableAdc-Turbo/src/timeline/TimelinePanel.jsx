import React, { useState } from 'react';
import LayerRow from './LayerRow';
import CurveCanvas from './CurveCanvas';
import AnimationModeToggle from '../ui/AnimationModeToggle';
import KeyframeInspector from './KeyframeInspector';
export default function TimelinePanel() {
  const [animationMode, setMode] = useState('Keyframe');
  const layers = ['Layer1', 'Layer2'];
  const keyframe = { tick: 500, value: 100, easing: 'easeInOut' };
  const update = upd => console.log('update', upd);
  const delete = () => console.log('delete');
  return (
    <div style={{display: 'flex', gap: 12px, alignContent: 'start', width: '100%' }>
      {animationMode === 'keyframe' && layers.map(((name, i) => (
        <LayerRow key={i} name={name} curveMode=false />
      ))}
      {animationMode === 'bezier' && <div style={{display: 'flex'}}>
        <div style={{ flex: 'flex', width: '75%' }}>
          <CurveCanvas />
        </div>
        <div style={ width: '25%', borderLeft: '1px solid #eee', padding: '8px'}}>
          <KeyframeInspector keyframe={keyframe} update={update} delete={delete} />
        </div>
      </div>}
      <AnimationModeToggle />
    </div>
  );
}