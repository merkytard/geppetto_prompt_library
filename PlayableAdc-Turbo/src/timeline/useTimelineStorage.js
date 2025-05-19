import { useState } from 'react';

const STORAGE_KEY = 'playable_timeline_data';

export function useTimelineStorage() {
    const [data, setData] = useState([]);

    // Load z localStorage
    React.useEffect(() => {
        const json = localStorage.getItem(STORAGE_KEY);
        if (json) {
            try {
                setData(JSON.parse(json));
            } catch (e) { console.error(e); }
        }
    }, []);

    // Save to localStorage
    const saveData = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    // Add new keyframe
    const addKeyframe = (kf) => {
        setData([...data, kf]);
        saveData();
    };

    // Remove keyframe
    const removeKeyframe = (id) => {
        const newData = data.filter(kf => kf.id !== id);
        setData(newData);
        saveData();
    };

    return { data, addKeyframe, removeKeyframe, saveData };
}