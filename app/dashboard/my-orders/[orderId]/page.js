import { getSiteSettings } from '@/utils/getSiteSettings';
import OrderDetailsPageContent from '../../components/OrderDetailsPageContent';

export async function generateMetadata({ params }) {
    const orderId = (await params)?.orderId;
    const siteSetting = await getSiteSettings();

    // Fallback data if siteSetting.data is empty or undefined
    const data = siteSetting?.data || {};

    // Generate keywords from title
    const generateKeywords = (text) => {
        return (
            text
                ?.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(/\s+/)
                .filter((word) => word.length > 2)
                .join(', ') || ''
        );
    };

    const titleKeywords = generateKeywords(data.title);

    return {
        title: `Order #${orderId} Details | ${data.title || 'Default Title'}`,
        description: `View details for order #${orderId} at ${
            data.title || 'Default Title'
        }. Track your order status and delivery information.`,
        keywords: `${titleKeywords}, order details, order tracking, order status, order ${orderId}`,
        icons: {
            icon: data.fev_icon || '/default-icon.png',
            apple: data.fev_icon || '/default-icon.png',
        },
        openGraph: {
            title: `Order #${orderId} Details - ${
                data.title || 'Default Title'
            }`,
            description: data.footer_description || 'Default description',
            url: `${
                data.website || 'https://example.com'
            }/dashboard/my-orders/${orderId}`,
            type: 'website',
            images: [
                {
                    url: data.header_logo || '/default-logo.png',
                    width: 1200,
                    height: 630,
                    alt: `${data.title || 'Default Title'} Logo`,
                },
            ],
            siteName: data.title || 'Default Title',
        },
        twitter: {
            card: 'summary',
            title: `Order #${orderId} Details - ${
                data.title || 'Default Title'
            }`,
            description: data.footer_description || 'Default description',
            images: data.header_logo || '/default-logo.png',
        },
        alternates: {
            canonical: `${
                data.website || 'https://example.com'
            }/dashboard/my-orders/${orderId}`,
        },
        robots: {
            index: false, // Don't index individual order pages
            follow: false,
            'max-image-preview': 'none',
            'max-snippet': -1,
            noarchive: true,
        },
        other: {
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
    };
}


const OrderDetailsPage = async ({ params }) => {
     const orderId = (await params).orderId;

    return (
        <main
            role="main"
            aria-label={`Order #${orderId} Details`}
            className="order-details-container"
        >
            <section className="order-details-content">
                <OrderDetailsPageContent orderId={orderId} />
            </section>
        </main>
    );
};

export default OrderDetailsPage;