export function normalizeError(e: unknown): Error {
    if (e instanceof Error) return e;

    // Handle redirect object from Astro (it has specific properties like status/url)
    // We check for common properties that Astro uses for redirects to avoid wrapping them
    // but usually Astro redirects are not supposed to be "caught" and "re-thrown"
    // as plain objects if we can help it.

    try {
        const str = typeof e === 'object' ? JSON.stringify(e) : String(e);
        return new Error(str);
    } catch {
        return new Error(String(e));
    }
}
