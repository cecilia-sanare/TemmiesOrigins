import { fetch, url } from '../utils/fetch.mjs';

const CF_API_KEY = process.env.CF_API_KEY;

if (!CF_API_KEY) {
    throw new Error(`A CurseForge API key must be provided!`);
}

export const post = url('https://api.curseforge.com', 'POST', {
    'x-api-key': CF_API_KEY
});

export async function getMods(modIds) {
    try {
        return await fetch(post('/v1/mods', {
            modIds
        }))
    } catch (error) {
        if (error.status === 403) {
            throw new Error(`CurseForge is rejecting our requests!`);
        }

        throw error;
    }
}