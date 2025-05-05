// const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    // unoptimized: true,
    // domains: [
    //     'admin.daarib.com',
    //     'shop.uibarn.com',
    //     '127.0.0.1:8000',
    //     '192.168.0.124',
    //     '127.0.0.1',
    //     'admin.evascollection.shop',
    //     'img.freepik.com',
    // ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.daarib.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.bioschale.de',
      },
      {
        protocol: 'https',
        hostname: 'admin.evascollection.shop',
      },
      {
        protocol: 'https',
        hostname: 'demoadmin.karbar.shop',
      },
      {
        protocol: 'https',
        hostname: 'admin.furnitobd.com',
      },
      {
        protocol: 'https',
        hostname:
          new URL(process.env.NEXT_PUBLIC_API_BASE_URL).hostname || 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.dreamshopkeeper.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.dhakaibd.com',
      },
      {
        protocol: 'https',
        hostname: 'karbar.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1:8000',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.149',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.dhakaibd.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.romartbd.com',
      },
    ],
  },
  // experimental: {
  //     missingSuspenseWithCSRBailout: false,
  // },
};

export default nextConfig;
