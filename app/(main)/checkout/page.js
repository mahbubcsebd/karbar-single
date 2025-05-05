import CheckoutPageContent from '@/_template/pages/checkout/CheckoutPageContent';
import { getSiteSettings } from '@/_utils/getSiteSettings';

export async function generateMetadata() {
    const siteSetting = await getSiteSettings();

    // Fallback data if siteSetting.data is empty or undefined
    const data = siteSetting?.data || {};

    // Generate keywords from title
    const generateKeywords = (text) => {
        return (
            text
                ?.toLowerCase()
                ?.replace(/[^a-z0-9\s]/g, '')
                ?.split(/\s+/)
                ?.filter((word) => word?.length > 2)
                ?.join(', ') || ''
        );
    };

    const titleKeywords = generateKeywords(data.title);

    return {
        title: `Checkout | ${data.title || 'Default Title'}`,
        description: `Complete your purchase at ${
            data.title || 'our store'
        }. Secure checkout process with multiple payment options.`,
        keywords: `${titleKeywords}, checkout, payment, order, secure payment`,
        openGraph: {
            title: `Checkout - ${data.title || 'Default Title'}`,
            description:
                data.footer_description ||
                'Secure checkout process with multiple payment options.',
            url: `${data.website || 'https://example.com'}/checkout`,
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
            title: `Checkout - ${data.title || 'Default Title'}`,
            description:
                data.footer_description ||
                'Secure checkout process with multiple payment options.',
            images: data.header_logo || '/default-logo.png',
        },
        alternates: {
            canonical: `${data.website || 'https://example.com'}/checkout`,
        },
        robots: {
            index: false, // Don't index checkout pages for security
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

const CheckoutRoute = async () => {
    return (
        <>
            <CheckoutPageContent />
        </>
    );
};

export default CheckoutRoute;
