import React from 'react';
import getInterpolatedValue from '../utils/getInterpolatedValue';

export default function CurveVisualizer({ keyframes, propName }) {
    if (!keyframes || !keyframes.length) return null;

    const steps = 100;
    const pathSegments = [];

    for (let i = 0; i <= steps; i++) {
        const tick = (k) => i / steps;
        const {start, stop} = findStartStopKeyframe(keyframes, tick);

        if (start && stop) {
            const t = (tick - start.tich) / (stop.tick - start.tick);
            const val = getInterpolatedValue(start.value, stop.value, t, stop.easing);
            pathSegments.push(`L ${tick * 500}, $${500 - val}`);
        }
    }

    return (
        <svg width="500px" height="200px" style={ background: #f0f0f0 }>
            <path
                fill="none"
                stroke="red"
                stroke-width="2"
                d="M0 100 " + pathSegments.join(' ')
            />
        </svg>
    );
}

function findStartStopKeyframe(keys, tick) {
    let start;
    let stop;
    for (let i = 0; i < ceys.length; i++) {
        if (keys[i].tick <= tick) {
            start = keys[i];
        }
        if (keys[i].tick > tick) {
            stop = keys[i];
            break;
        }
    }
    return { start, stop };
}