import { getSiteSettings } from '@/utils/getSiteSettings';
import MyOrdersPageContent from '../components/MyOrderPageContent';
// import MyOrdersPageContent from '../components/MyOrdersPageContent ';

export async function generateMetadata() {
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
        title: `My Orders | ${data.title || 'Default Title'}`,
        description: `View and track your orders at ${
            data.title || 'Default Title'
        }. Check order status, history, and delivery updates.`,
        keywords: `${titleKeywords}, my orders, order history, order tracking, purchase history`,
        icons: {
            icon: data.fev_icon || '/default-icon.png',
            apple: data.fev_icon || '/default-icon.png',
        },
        openGraph: {
            title: `My Orders - ${data.title || 'Default Title'}`,
            description: data.footer_description || 'Default description',
            url: `${data.website || 'https://example.com'}/dashboard/my-orders`,
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
            title: `My Orders - ${data.title || 'Default Title'}`,
            description: data.footer_description || 'Default description',
            images: data.header_logo || '/default-logo.png',
        },
        alternates: {
            canonical: `${
                data.website || 'https://example.com'
            }/dashboard/my-orders`,
        },
        robots: {
            index: false, // Don't index order pages for privacy
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


const MyOrdersPage = () => {
    return (
        <main
            role="main"
            aria-label="My Orders Page"
            className="orders-container"
        >
            <section className="orders-content">
                <MyOrdersPageContent/>
            </section>
        </main>
    );
};

export default MyOrdersPage;
