import { fetch, url } from '../utils/fetch.mjs';

export const get = url('https://api.modrinth.com', 'GET', {
    'User-Agent': 'github.com/cecilia-sanare/TemmiesOrigins (admin@cecilias.me)'
});

export function getProjects(projectIds) {
    return fetch(get(`/v2/projects?ids=${JSON.stringify(projectIds)}`));
}

export function getProjectTeams(teamIds) {
    return fetch(get(`/v2/teams?ids=${JSON.stringify(teamIds)}`));
}