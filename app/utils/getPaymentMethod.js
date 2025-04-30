const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPaymentMethod() {
    const res = await fetch(`${baseUrl}/payment-methods`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        // throw new Error('Failed to fetch Payment Method');
        return res.json();
    }

    try {
        return res.json();
    } catch (error) {
        throw new Error('Error parsing payment method data');
    }
}
