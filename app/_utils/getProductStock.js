const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getProductStock(id, newAttributes) {
    const res = await fetch(
        `${baseUrl}/product/${id}/variants?${newAttributes}`,
        {
            cache: 'no-cache'
        }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch stock');
    }

    return res.json();
}
