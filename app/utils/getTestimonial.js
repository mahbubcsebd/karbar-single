const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getTestimonials(lang) {
    const res = await fetch(`${baseUrl}/get-product-reviews`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Testimonials');
    }

    return res.json();
}