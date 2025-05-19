import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProjectStore = create(persist((set) => ({
    scenes: [],
    activeScene: 0,
    undoStack: [],

    addScene: (data)=> set(state => {
        const undo = [...state.undoStack];
        const scenes = [...state.scenes];
        if (undo.length >= 10) { undo.shift(); }
        undo.push(scenes);
        return {
            scenes: [...scenes, data],
            undoStack: undo
        };
    }),

    setSceneData: (index, data) => set(state => {
        const scenes = [...state.scenes];
        scenes[index] = data;
        return { scenes };
    },

    undo: () => set(state => {
        const updated = state.undoStack.concat(state.scenes);
        const last = updated.pop();
        return {
            scenes: last,
            undoStack: updated
        };
    }
}), { name: 'playable_project_state' });