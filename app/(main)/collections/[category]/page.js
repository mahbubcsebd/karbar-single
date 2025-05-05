import CollectionsPageContent from '@/_template/pages/collections/CollectionsPageContent';
import { getSiteSettings } from '@/_utils/getSiteSettings';

export async function generateMetadata({ params }) {
    const category = (await params).category;
    const siteSetting = await getSiteSettings();

    // Fallback data if siteSetting.data is empty or undefined
    const data = siteSetting?.data || {};

    // Generate keywords from title and category
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
    const categoryKeywords = generateKeywords(category?.replace(/-/g, ' '));

    return {
        title: `${
            category?.replace(/-/g, ' ')?.toUpperCase() || 'Category'
        } | ${data.title || 'Default Title'}`,
        description: `Shop our collection of ${
            category?.replace(/-/g, ' ') || 'items'
        } at ${
            data.title || 'our store'
        }. Find the best deals and latest trends.`,
        keywords: `${categoryKeywords}, ${titleKeywords}, shop online, best deals, latest collection`,
        icons: {
            icon: data.fev_icon || '/default-favicon.png',
            apple: data.fev_icon || '/default-favicon.png',
        },
        openGraph: {
            title: `${
                category?.replace(/-/g, ' ')?.toUpperCase() || 'Category'
            } - ${data.title || 'Default Title'}`,
            description:
                data.footer_description ||
                'Find the best deals and latest trends.',
            url: `${
                data.website || 'https://example.com'
            }/collections/${category}`,
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
            card: 'summary_large_image',
            title: `${
                category?.replace(/-/g, ' ')?.toUpperCase() || 'Category'
            } - ${data.title || 'Default Title'}`,
            description:
                data.footer_description ||
                'Find the best deals and latest trends.',
            images: data.header_logo || '/default-logo.png',
        },
        alternates: {
            canonical: `${
                data.website || 'https://example.com'
            }/collections/${category}`,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    };
}

const CollectionsPage = async ({ params }) => {
     const category = (await params).category;
    return (
        <div>
            <CollectionsPageContent category={category} />
        </div>
    );
};

export default CollectionsPage;
