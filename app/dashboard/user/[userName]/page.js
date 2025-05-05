import { getSiteSettings } from '@/_utils/getSiteSettings';
import UserPageContent from '../../_components/UserPageContent';

export async function generateMetadata({ params }) {
    const userName = (await params)?.userName;
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
        title: `My Profile | ${data.title || 'Default Title'}`,
        description: `Manage your profile and account settings at ${
            data.title || 'Default Title'
        }. Update personal information, view order history, and more.`,
        keywords: `${titleKeywords}, user profile, account settings, my account, dashboard`,
        icons: {
            icon: data.fev_icon || '/default-icon.png',
            apple: data.fev_icon || '/default-icon.png',
        },
        openGraph: {
            title: `My Profile - ${data.title || 'Default Title'}`,
            description: data.footer_description || 'Default description',
            url: `${data.website || 'https://example.com'}/dashboard/user/${
                userName || 'default-user'
            }`,
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
            title: `My Profile - ${data.title || 'Default Title'}`,
            description: data.footer_description || 'Default description',
            images: data.header_logo || '/default-logo.png',
        },
        alternates: {
            canonical: `${
                data.website || 'https://example.com'
            }/dashboard/user/${userName || 'default-user'}`,
        },
        robots: {
            index: false, // Don't index user profile pages
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


const UserPage = async ({ params }) => {
     const userName = (await params).userName;

    return (
        <main
            role="main"
            aria-label="User Profile Page"
            className="user-profile-container"
        >
            <section className="profile-content">
                <UserPageContent userName={userName} />
            </section>
        </main>
    );
};

export default UserPage;
