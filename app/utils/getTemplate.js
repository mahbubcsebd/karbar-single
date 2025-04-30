const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getTemplate() {
    const res = await fetch(`${baseUrl}/template-theme`, {
        next: {
            revalidate: 0,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Template');
    }

    return res.json();
}
