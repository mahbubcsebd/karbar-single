const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCoupon(couponCode) {
    const res = await fetch(
        `${baseUrl}/coupon-code-validation-check?coupon_code=${couponCode}`,
        { cache: 'no-store' }
    );

    //console.log(res);

    // if (!res.ok) {
    //     throw new Error('Failed to fetch coupon');
    // }

    return res.json();
}
