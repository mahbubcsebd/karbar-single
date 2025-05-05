import { getSiteSettings } from '@/_utils/getSiteSettings';
import { Suspense } from 'react';
import PosHeader from './_component/PosHeader';
import TallyPage from './_component/TallyPage';

export async function generateMetadata() {
    const siteSetting = await getSiteSettings('en');
    const siteData = siteSetting.data || {}; // Fallback to an empty object if data is missing

    // Default values
    const defaultTitle = 'Your Website Title';
    const defaultDescription = 'Your default description goes here.';
    const defaultWebsite = 'https://yourwebsite.com';
    const defaultLogo = '/default-logo.png';
    const defaultIcon = '/default-icon.png';

    // Generate keywords from site title
    const generateKeywords = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .split(/\s+/) // Split by whitespace
            .filter((word) => word.length > 2) // Remove words shorter than 3 characters
            .join(', ');
    };

    const title = siteData.title || defaultTitle;
    const description = siteData.footer_description || defaultDescription;
    const website = siteData.website || defaultWebsite;
    const headerLogo = siteData.header_logo || defaultLogo;
    const fevIcon = siteData.fev_icon || defaultIcon;

    const titleKeywords = generateKeywords(title);

    return {
        title: `${title} | Tally`,
        description: description,
        keywords: `${titleKeywords}, Tally, online shopping`,
        icons: {
            icon: fevIcon,
            apple: fevIcon,
        },
        openGraph: {
            title: title,
            description: description,
            url: website,
            type: 'website',
            images: [
                {
                    url: headerLogo,
                    width: 1200,
                    height: 630,
                    alt: `${title} Logo`,
                },
            ],
            siteName: title,
        },
        twitter: {
            card: 'summary',
            title: title,
            description: description,
            images: headerLogo,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
        alternates: {
            canonical: website,
        },
        other: {
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
    };
}



const Tally = async () => {
    const siteSetting = await getSiteSettings('en');
  return (
      <div>
          <PosHeader logo={siteSetting.data.logo} />
          <Suspense fallback={<div></div>}>
            <TallyPage />
          </Suspense>
      </div>
  );
}

export default Tally;