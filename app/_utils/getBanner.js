const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getSingleBanner() {
    const res = await fetch(`${baseUrl}/single-banner`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Hero image');
    }

    return res.json();
}

export async function getMultipleBanner() {
    const res = await fetch(`${baseUrl}/multiple-banner`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Hero image');
    }

    return res.json();
}
