const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getBrands() {
    const res = await fetch(`${baseUrl}/brands`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch brands');
    }

    return res.json();
}
