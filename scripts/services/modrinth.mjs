import { FormData } from 'node-fetch';
import { fetch, url } from '../utils/fetch.mjs';

const MODRINTH_API = 'https://api.modrinth.com/v2';
const GH_TOKEN = process.env.GH_TOKEN;

export const get = url(MODRINTH_API, 'GET', {
    'User-Agent': 'github.com/temmies-origins/temmies-origins-modpack (admin@cecilias.me)'
});

export const patch = url(MODRINTH_API, 'PATCH', {
    'Authorization': GH_TOKEN,
    'User-Agent': 'github.com/temmies-origins/temmies-origins-modpack (admin@cecilias.me)'
});

export const post = url(MODRINTH_API, 'POST', {
    'Authorization': GH_TOKEN,
    'User-Agent': 'github.com/temmies-origins/temmies-origins-modpack (admin@cecilias.me)'
});

export async function getProjects(projectIds) {
    return await fetch(get(`/projects?ids=${JSON.stringify(projectIds)}`));
}

export async function getProjectTeams(teamIds) {
    return await fetch(get(`/teams?ids=${JSON.stringify(teamIds)}`));
}

export async function updateProject(projectId, project) {
    return await fetch(patch(`/project/${projectId}`, project));
}