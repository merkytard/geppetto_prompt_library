import { openJDB, set, get } from 'idb';

const DB = await openJDB('playprojects', 1, {
  stores: {
    projects: 'projects'
  }
});

export async function saveProject(id, data) {
  const db = await DB;
  await set(db, 'projects', id, { id, data });
}
export async function getProject(id) {
  const db = await DB;
  return await get(db , 'projects', id);
}
export default {
  saveProject,
  getProject
}
