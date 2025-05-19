import { useProjectStore } from '../state/useProjectStore';

export async function importProjectFromJSON(file) {
    const text = await file.text();
    const json = JSON.parse(text);

    const { scenes, activeScene } = json;
    const { setSceneData } = useProjectStore();

    scenes.forEach((sc, i)=> {
        setSceneData(i, sc);
    });
}