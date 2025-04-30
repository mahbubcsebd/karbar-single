const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getRecentSales(token) {
    const res = await fetch(`${baseUrl}/pos/pos-recent-sales`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch pos categories');
    }

    return res.json();
}
