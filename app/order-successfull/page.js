import OrderSuccess from '../components/OrderSuccess';
import { getSiteSettings } from '../utils/getSiteSettings';


  export async function generateMetadata() {
      // Fetch site settings with fallback to ensure it doesn't break if fetching fails
      const siteSetting = (await getSiteSettings('en')) || {};

      return {
          title: `${
              siteSetting?.data?.title || 'Default Site Title'
          } | Order Success Page`,
          description: `Your order was successfully placed at ${
              siteSetting?.data?.title || 'Default Site Title'
          }. Check your order details and delivery status.`,
          keywords:
              siteSetting?.data?.keywords ||
              'order success, order tracking, order confirmation',
          icons: {
              icon: siteSetting?.data?.fev_icon || '/default-icon.png',
              apple: siteSetting?.data?.fev_icon || '/default-icon.png',
          },
          openGraph: {
              title: siteSetting?.data?.title || 'Default Site Title',
              description:
                  siteSetting?.data?.footer_description ||
                  'Default description',
              url:
                  siteSetting?.data?.website ||
                  'https://example.com/order-success',
              type: 'website',
              images: [
                  {
                      url:
                          siteSetting?.data?.header_logo || '/default-logo.png',
                      width: 1200,
                      height: 630,
                      alt:
                          siteSetting?.data?.title || 'Default Site Title Logo',
                  },
              ],
          },
          twitter: {
              card: 'summary',
              title: siteSetting?.data?.title || 'Default Site Title',
              description:
                  siteSetting?.data?.footer_description ||
                  'Default description',
              images: siteSetting?.data?.header_logo || '/default-logo.png',
          },
          alternates: {
              canonical: `${
                  siteSetting?.data?.website || 'https://example.com'
              }/order-success`,
          },
          robots: {
              index: true, // Allow indexing of the order success page
              follow: true,
              'max-image-preview': 'large',
              'max-snippet': -1,
              noarchive: false,
          },
          other: {
              'X-Robots-Tag': 'noindex, nofollow, noarchive', // For other specific cases
          },
      };
  }


const OrderSuccessfull = async () => {
    const siteSetting = await getSiteSettings();
  return (
      <div>
          <OrderSuccess title={siteSetting.data.title} />
      </div>
  );
}

export default OrderSuccessfull