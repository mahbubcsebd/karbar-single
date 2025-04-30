const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getTallyProducts(token = null) {

    const res = await fetch(`${baseUrl}/pos/tally-products`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch tally product');
    }

    return res.json();
}
