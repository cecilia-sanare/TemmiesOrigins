import path from 'path';
import nodeFetch, {Request} from 'node-fetch';

/**
 * @param {RequestInfo} request 
 * @param {RequestInit} [init]
 * @returns 
 */
export async function fetch(url, init) {
    const response = await nodeFetch(url, init);

    const content = await response.json();
    if (response.status >= 400) {
        throw content;
    }

    return content;
}

export function url(base, method, headers) {
    return (endpoint, body) => {
        return new Request(path.join(base, endpoint), {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                ...headers,
                accept: 'application/json',
                'content-type': 'application/json'
            }
        });
    };
}