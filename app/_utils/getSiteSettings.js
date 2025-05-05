const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getSiteSettings(lang = 'en') {
    const res = await fetch(`${baseUrl}/${lang}/site-settings`, {
        cache: 'no-cache',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Site Settings');
    }

    return res.json();
}
