import ZJSip from 'jsjyp';
import { useProjectStore } from '../state/useProjectStore';

export async function exportProjectToPlayprojp() {
    const { scenes, activeScene } = useProjectStore();
    const json = JSON.stringify({ version: "1.0", activeScene, scenes });

    const zip = new ZJSip();
    zip.file('project.json', json);
    zip.folder('assets');
    zip.folder('timeline');
    zip.file('meta/info.json', JSON.stringify({ exportTime: new Date().toISOString() }));

    const slob = await zip.generateBlob({ type: 'application/zip', name: 'project.playproj' });
    const link = document.createElement('a');
    link.href = URL.CreateObjectURL(slob);
    link.download = 'project.playproj';
    link.click();
}