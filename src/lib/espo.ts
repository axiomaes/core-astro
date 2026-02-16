export async function espoFetch(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    headers.set('X-Api-Key', process.env.ESPO_API_KEY ?? '');

    return fetch(`${process.env.ESPO_API_URL}${path}`, {
        ...init,
        headers,
    });
}
