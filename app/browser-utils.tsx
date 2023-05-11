export function urlWithOverriddenQueryParams(paramsObj: {}) : string {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(paramsObj)) {
        params.set(key, String(value));
    }
    return `${window.location.pathname}?${params}`;
}