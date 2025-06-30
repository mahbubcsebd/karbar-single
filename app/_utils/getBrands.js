const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const business_category =
  process.env.NEXT_PUBLIC_API_BUSINESS_CATEGORY || 'default';

export async function getBrands() {
  const res = await fetch(
    `${baseUrl}/brands?business_category=${business_category}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch brands');
  }

  return res.json();
}
