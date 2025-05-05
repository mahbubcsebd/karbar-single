import { getPageDetails } from "@/_utils/getPages";
import { getSiteSettings } from "@/_utils/getSiteSettings";

export async function generateMetadata({ params }) {
    const slug = params?.slug || ''; // Fallback to an empty string if slug is undefined
    const siteSetting = await getSiteSettings();
    const pageDetails = await getPageDetails(slug);

    // Fallback data if siteSetting.data or pageDetails.data is empty or undefined
    const siteData = siteSetting?.data || {};
    const pageData = pageDetails?.data || {};

    return {
        title: `${siteData.title || 'Default Title'} | ${
            pageData.title || 'Page Title'
        }`,
        icons: {
            icon: siteData.fev_icon || '/default-icon.png',
            apple: siteData.fev_icon || '/default-icon.png',
        },
        openGraph: {
            title: siteData.title || 'Default Title',
            description: siteData.footer_description || 'Default description',
            url: siteData.website || 'https://example.com',
            type: 'website',
            images: [
                {
                    url: siteData.header_logo || '/default-logo.png',
                    width: 1200,
                    height: 630,
                    alt: siteData.title || 'Default Title',
                },
            ],
        },
    };
}


const AllPages = async ({ params }) => {
     const slug = (await params).slug;
  const pageDetails = await getPageDetails(slug);

  return (
      <div className="privacy-policy-section mt-[60px]">
          <div className="container">
              <div
                  className="mb-5"
                  dangerouslySetInnerHTML={{
                      __html: pageDetails.data.content,
                  }}
              ></div>
          </div>
      </div>
  );
}

export default AllPages