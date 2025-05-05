const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getFaq(lang = 'en') {
    const res = await fetch(`${baseUrl}/${lang}/faq-list`, { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Failed to fetch Faq');
    }

    return res.json();
}
