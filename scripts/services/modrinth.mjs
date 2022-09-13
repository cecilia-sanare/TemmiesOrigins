import { fetch, url } from '../utils/fetch.mjs';

export const get = url('https://api.modrinth.com', 'GET', {
    'User-Agent': 'github.com/cecilia-sanare/TemmiesOrigins (admin@cecilias.me)'
});

export async function getProjects(projectIds) {
    return await fetch(get(`/v2/projects?ids=${JSON.stringify(projectIds)}`));
}

export async function getProjectTeams(teamIds) {
    return await fetch(get(`/v2/teams?ids=${JSON.stringify(teamIds)}`));
}