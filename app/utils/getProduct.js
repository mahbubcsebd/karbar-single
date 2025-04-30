const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllProduct(
    lang = 'en',
    category = null,
    subCategory = '',
    sort_by = null,
    search = '',
    page = 1,
    perPage = 12,
    brandId= 'all'
) {
    const res = await fetch(
        `${baseUrl}/${lang}/products?search=${search}&category=${category}&sub_category=${subCategory}&page=${page}&perPage=${perPage}&sort_by=${sort_by}&brand_id=${brandId}`,
        { cache: 'no-store' }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }

    return res.json();
}

export async function getCategoryWiseProduct(lang = 'en', perPage = 8) {
    const res = await fetch(
        `${baseUrl}/${lang}/category-wise-products?perPage=${perPage}`
    );

    if (!res.ok) {
        throw new Error('Failed to fetch Category wise product');
    }

    return res.json();
}

export async function getProduct(lang = 'en', uuid) {
    const res = await fetch(`${baseUrl}/${lang}/product/${uuid}`);

    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }

    return res.json();
}
