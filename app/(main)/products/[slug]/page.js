import ProductDetailsPageContent from '@/_template/pages/product-details/ProductDetailsPageContent';
import { getProduct } from '@/_utils/getProduct';
import { getSiteSettings } from '@/_utils/getSiteSettings';

export async function generateMetadata({ params }) {
    const slug = (await params).slug;
    const siteSetting = await getSiteSettings();
    const product = await getProduct('en', slug);

    // Check if product data exists
    if (!product?.data) {
        return {
            title: `Product Not Found | ${
                siteSetting?.data?.title || 'Site Title'
            }`,
            description:
                'Sorry, we could not find the product you are looking for.',
            keywords: 'product not found, 404, product page',
            openGraph: {
                title: 'Product Not Found',
                description:
                    'Sorry, we could not find the product you are looking for.',
                type: 'website',
                url: `${siteSetting?.data?.website}/products/${slug}`,
                images: [],
                siteName: siteSetting?.data?.title || 'Site Title',
            },
            twitter: {
                card: 'summary',
                title: 'Product Not Found',
                description:
                    'Sorry, we could not find the product you are looking for.',
                images: [],
            },
        };
    }

    const {
        name,
        description,
        product_images,
        unit_price,
        sale_price,
        sku_code,
        stock,
    } = product.data;

    // Generate keywords from name by splitting and removing special characters
    const generateKeywords = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .split(/\s+/) // Split by whitespace
            .filter((word) => word.length > 2) // Remove words shorter than 3 characters
            .join(', ');
    };

    const nameKeywords = generateKeywords(name);
    const titleKeywords = generateKeywords(
        siteSetting?.data?.title || 'Site Title'
    );

    // Format price for structured data
    const currentPrice = sale_price > 0 ? sale_price : unit_price;

    return {
        title: `${name} | ${siteSetting?.data?.title || 'Site Title'}`,
        description:
            description ||
            `Buy ${name} from ${siteSetting?.data?.title || 'our store'}`,
        keywords: `${nameKeywords}, ${titleKeywords}, online shopping, ${name}`,
        openGraph: {
            title: name,
            description: description,
            type: 'website',
            url: `${siteSetting?.data?.website}/products/${slug}`,
            images: product_images?.[0]?.original_url
                ? [
                      {
                          url: product_images[0].original_url,
                          width: 800,
                          height: 600,
                          alt: name,
                      },
                  ]
                : [],
            siteName: siteSetting?.data?.title || 'Site Title',
        },
        twitter: {
            card: 'product',
            title: name,
            description: description,
            images: product_images?.[0]?.original_url || '',
        },
        alternates: {
            canonical: `${siteSetting?.data?.website}/products/${slug}`,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
        other: {
            'product:price:amount': currentPrice,
            'product:price:currency': 'BDT',
            'product:availability': stock > 0 ? 'in stock' : 'out of stock',
            'product:condition': 'new',
            'product:brand': 'Samsung', // You can modify this as per product brand
            'product:sku': sku_code,
        },
    };
}

const ProductDetailsRoute = async ({ params }) => {
     const slug = (await params).slug;
    return (
        <div>
            <ProductDetailsPageContent slug={slug} />
        </div>
    );
};

export default ProductDetailsRoute;
