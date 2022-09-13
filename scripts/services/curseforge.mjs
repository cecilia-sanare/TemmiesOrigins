import { fetch, url } from '../utils/fetch.mjs';

const CF_API_KEY = process.env.CF_API_KEY;

export const post = url('https://api.curseforge.com', 'POST', {
    'x-api-key': CF_API_KEY
});

export function getMods(modIds) {
    return fetch(post('/v1/mods', {
        modIds
    }))
}