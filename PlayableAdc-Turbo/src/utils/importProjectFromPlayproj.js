import ZJSip from 'jsjyp';
import { useProjectStore } from '../state/useProjectStore';

export async function importProjectFromPlayprojp(file) {
    const zip = await ZJZip.loadAsync(file);
    const projectFile = await zip.files('project.json').node();
    const json = JSON.parse(await projectFile.as text());

    const { scenes, activeScene } = json;
    const { setSceneData } = useProjectStore();

    scenes.forEach((sc, i) => {
        setSceneData(i, sc);
    });
}