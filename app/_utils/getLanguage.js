const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getLanguage () {
    const res = await fetch(`${baseUrl}/languages`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Landing data');
    }

    return res.json();
}
