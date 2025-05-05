const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function orderPost(orderData, token) {
    // Base headers
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    // Add Authorization header if token exists
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}/product-order`, {
        method: 'POST',
        headers,
        body:orderData
    });

    const data = await res.json();
    return Response.json(data);
}
