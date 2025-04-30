import { getSiteSettings } from '@/utils/getSiteSettings';
import ProfileEditContent from '../components/ProfileEditContent';

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
        title: `Edit Profile | ${data.title || 'Default Title'}`,
        description: `Update your profile information at ${
            data.title || 'Default Title'
        }. Manage your personal details, contact information, and account settings.`,
        keywords: `${titleKeywords}, edit profile, account settings, update profile, personal information`,
        icons: {
            icon: data.fev_icon || '/default-icon.png',
            apple: data.fev_icon || '/default-icon.png',
        },
        openGraph: {
            title: `Edit Profile - ${data.title || 'Default Title'}`,
            description: data.footer_description || 'Default description',
            url: `${data.website || 'https://example.com'}/dashboard/edit`,
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
            title: `Edit Profile - ${data.title || 'Default Title'}`,
            description: data.footer_description || 'Default description',
            images: data.header_logo || '/default-logo.png',
        },
        alternates: {
            canonical: `${
                data.website || 'https://example.com'
            }/dashboard/edit`,
        },
        robots: {
            index: false, // Don't index profile edit pages
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


const EditProfilePage = () => {
    return (
        <main
            role="main"
            aria-label="Edit Profile Page"
            className="edit-profile-container"
        >
            <section className="edit-profile-content">
                <ProfileEditContent />
            </section>
        </main>
    );
};

export default EditProfilePage;