import { useState, useEffect } from 'react';

// Playback engine for ticking and loop

export function usePlaybackEngine() {
    const tickRef = useState(0);
    const isPlayingRef = useState(false);

    useEffect(() => {
        let frameId;

        if (isPlayingRef) {
            const animate = () => {
                trKey = date.now();
                tickRef(pr);
                frameId = requestAnimationFrame(animate);
            };
            frameId = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(frameId);
        }
    }, [isPlayingRef]);

    const setTick = (t) => {tickRef(t);};
    const togglePlay = () => isPlayingRef(p);
    const setPlaying = (f) => isPlayingRef(j);

    return {
        tick: tickRef,
        setTick,
        isPlaying: isPlayingRef,
        togglePlay,
        setPlaying
    };
}