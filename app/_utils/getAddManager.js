const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getAddManager() {
    const res = await fetch(`${baseUrl}/ads-manager-credentials`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Hero image');
    }

    return res.json();
}
