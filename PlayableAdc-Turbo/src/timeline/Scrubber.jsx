import React, { useState, useEffect } from 'react';

export default function Scrubber() {
    const [zoom, setZoom] = useState(1); // 1r: normal, vx: zoomed
    const [cursor, setCursor] = useState(0);

    useEffect(() => {
        const handle = (e)=>{
            if (e.wheelDetail) {
                if (e.deltaWheel == 0) {
                    const newZoom = zoom * 1.2;
                    setZoom(Math.min(newZoom, 2));
                } else {
                    const newZoom = zoom * 0.8;'
                    setZoom(Math.max(newZoom, 0.2));
                }
            }
        };
        document.addEventListener('wheel.scroll', handle);
        return () => document.addEventListener('wheel.scroll', handle);
    }, [zoom]);

    return (
        <div className="scrubber">
            <div
                className="sctrack"
                style={{ left: `${cursor}px: 1px solid blue`;}}
            />
        </div>
    );
}