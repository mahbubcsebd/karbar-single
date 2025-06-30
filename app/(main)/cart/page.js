import CartPageContent from '@/_template/pages/cart/CartPageContent';

import { getSiteSettings } from '@/_utils/getSiteSettings';

export async function generateMetadata() {
  const siteSetting = await getSiteSettings();
  const data = siteSetting?.data || {};

  const generateKeywords = (text) =>
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9\s]/g, '')
      ?.split(/\s+/)
      ?.filter((word) => word.length > 2)
      ?.join(', ') || '';

  const currentDate = new Date().toISOString();

  const title = `Your Cart | ${data.title || 'Shop Now'}`;
  const description = `View items in your cart. Complete your shopping experience at ${
    data.title || 'our store'
  }.`;

  const titleKeywords = generateKeywords('cart shopping bag checkout');
  const descKeywords = generateKeywords(description);

  return {
    title: {
      default: title,
      template: `%s | ${data.title || 'Shop Now'}`,
    },
    description,
    keywords: `${titleKeywords}, ${descKeywords}, cart page, checkout, ecommerce shopping`,

    metadataBase: new URL(data.website || 'https://example.com'),

    openGraph: {
      title,
      description,
      url: `${data.website || 'https://example.com'}/cart`,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: data.header_logo || '/default-logo.png',
          width: 1200,
          height: 630,
          alt: data.title || 'Your Cart',
        },
      ],
      siteName: data.title || 'Shop Now',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [data.header_logo || '/default-logo.png'],
      creator: '@' + (data.title?.replace(/\s+/g, '') || 'shopuser'),
    },

    alternates: {
      canonical: `${data.website || 'https://example.com'}/cart`,
      languages: {
        'en-US': '/en/cart',
        'bn-BD': '/bn/cart',
      },
    },

    robots: {
      index: false, // cart page usually not indexed
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none',
        'max-video-preview': -1,
        'max-snippet': -1,
      },
    },

    verification: {
      google: data.google_domain_verification_code || '',
      facebook: data.facebook_domain_verification_code || '',
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
      'msapplication-TileColor': data.btn_bg_color || '#ffffff',
      'msapplication-TileImage': data.fev_icon || '/default-icon.png',
      'theme-color': data.btn_bg_color || '#ffffff',
      'format-detection': 'telephone=no',
      'article:published_time': currentDate,
      'article:modified_time': currentDate,
    },
  };
}

const CartPage = () => {
  return (
    <>
      <CartPageContent />
    </>
  );
};

export default CartPage;
