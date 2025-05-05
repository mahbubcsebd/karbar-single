import { getSiteSettings } from '@/_utils/getSiteSettings';
import HomePageContent from '../_template/pages/home/HomePageContent';

export async function generateMetadata() {
    const siteSetting = await getSiteSettings();

    // Fallback data if siteSetting.data is empty or undefined
    const data = siteSetting?.data || {};

    // Generate keywords from site title and description
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
    const descKeywords = generateKeywords(data.footer_description);

    // Format current date for sitemap
    const currentDate = new Date().toISOString();

    return {
        title: {
            default: data.title || 'Default Title',
            template: `%s | ${data.title || 'Default Title'}`,
        },
        description: data.footer_description || 'Default description',
        keywords: `${titleKeywords}, ${descKeywords}, online shopping, ecommerce, bangladesh shop`,

        metadataBase: new URL(data.website || 'https://example.com'),

        openGraph: {
            title: data.title || 'Default Title',
            description: data.footer_description || 'Default description',
            url: data.website || 'https://example.com',
            type: 'website',
            locale: 'en_US',
            images: [
                {
                    url: data.header_logo || '/default-logo.png',
                    width: 1200,
                    height: 630,
                    alt: data.title || 'Default Title',
                },
            ],
            siteName: data.title || 'Default Title',
        },

        twitter: {
            card: 'summary_large_image',
            title: data.title || 'Default Title',
            description: data.footer_description || 'Default description',
            images: [data.header_logo || '/default-logo.png'],
            creator: '@' + (data.title?.replace(/\s+/g, '') || 'defaultuser'),
        },

        alternates: {
            canonical: data.website || 'https://example.com',
            languages: {
                'en-US': '/en',
                'bn-BD': '/bn',
            },
        },

        robots: {
            index: true,
            follow: true,
            nocache: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-video-preview': -1,
                'max-snippet': -1,
            },
        },

        verification: {
            google: 'your-google-site-verification',
            facebook: 'your-facebook-domain-verification',
        },

        icons: {
            icon: data.fev_icon || '/default-icon.png',
            shortcut: data.fev_icon || '/default-icon.png',
            apple: data.fev_icon || '/default-icon.png',
            other: {
                rel: 'apple-touch-icon-precomposed',
                url: data.fev_icon || '/default-icon.png',
            },
        },

        other: {
            'msapplication-TileColor': '#ffffff',
            'msapplication-TileImage': data.fev_icon || '/default-icon.png',
            'theme-color': '#ffffff',

            // Schema.org markup for Google
            'og:site_name': data.title || 'Default Title',
            'og:type': 'website',
            'og:locale': 'en_US',

            // Article publishing meta
            'article:published_time': currentDate,
            'article:modified_time': currentDate,
            'article:section': 'E-commerce',

            // Rich Results testing
            'format-detection': 'telephone=no',
        },
    };
}

const HomeRoute = () => {
    return (
        <div>
            <HomePageContent />
        </div>
    );
};

export default HomeRoute;
