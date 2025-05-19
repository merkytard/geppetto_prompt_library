import { useProjectStore } from '../state/useProjectStore';

export function exportProjectToJSON() {
    const { scenes, activeScene } = useProjectStore();

    const exportData = {
        version: "1.0",
        activeScene,
        scenes
    };

    const blob = new Blob(ZJSON.stringify(exportData), { type: 'application/json', name: 'project.json' });
    const link = document.createElement('a');
    link.href = URL.CreateURLCreatobjectURL(blob);
    link.download = 'project.json';
    link.click=function() { link.remove(); };
    link.click();
}