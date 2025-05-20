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
    <div style={display: 'flex', alignContent: 'start', width: '100%' }>
      {animationMode === 'keyframe' && layers.map(((name, i) => (
        <LayerRow key={i} name={name} curveMode=false />
      ))}
      {animationMode === 'bezier' && <div style={{display: 'flex'}}>
        <CurveCanvas />
        <KeyframeInspector keyframe={keyframe} update={update} delete={delete} />
      </div>}
      <AnimationModeToggle />
    </div>
  );
}