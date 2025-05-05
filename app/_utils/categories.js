const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllCategories(lang = 'en') {
    const res = await fetch(
        `${baseUrl}/${lang}/categories`,
        { cache: 'no-store' }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    return res.json();
}
