const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getPages() {
    const res = await fetch(`${baseUrl}/pages`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch pages');
    }

    return res.json();
}

export async function getPageDetails(slug) {
    const res = await fetch(`${baseUrl}/page-details/${slug}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch page details');
    }

    return res.json();
}
