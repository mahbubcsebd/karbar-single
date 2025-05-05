const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPosProductProducts(
    token = null,
    category = null,
    search = null,
    page = 1,
    perPage = 12
) {
    const res = await fetch(
        `${baseUrl}/pos/pos-products?search=${search}&category_id=${category}&page=${page}&perPage=${perPage}`,
        {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch pos product');
    }

    return res.json();
}
