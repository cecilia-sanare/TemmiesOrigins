import path from 'path';
import nodeFetch, {Request} from 'node-fetch';

/**
 * @param {RequestInfo} request 
 * @param {RequestInit} [init]
 * @returns 
 */
export async function fetch(url, init) {
    const response = await nodeFetch(url, init);

    const contentType = response.headers.get('content-type') ?? 'application/text';
    const content = contentType.includes('json') ? await response.json() : await response.text();
    if (response.status >= 400) {
        const error = new Error(content || `Failed to retrieve data from: ${typeof url === 'string' ? url : url.url}`);
        error.status = response.status;
        throw error;
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