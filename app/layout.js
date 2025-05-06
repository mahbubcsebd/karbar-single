'use client';

import { GoogleTagManager } from '@next/third-parties/google';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { useEffect, useReducer, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import messanger from '../app/assets/icons/messanger.svg';
import whatsapp from '../app/assets/icons/whatsapp.svg';
import FBConversionApi from './_components/add-manager/FBConversionApi';
import FBPixel from './_components/add-manager/FBPixel';
import Announcement from './_components/Announcement';
import ScrollToTop from './_components/ScrollToTop';
import { BrandProvider } from './_context/brandContext';
import { ProductContext } from './_context/cartContext';
import { LanguageProvider } from './_context/LanguageContext';
import { SiteSettingProvider } from './_context/SiteSettingContext';
import { SortProvider } from './_context/SortContext';
import { TemplateProvider } from './_context/TemplateContext';
import { UserProvider } from './_context/UserContext';
import AdProvider from './_provider/AdProvider';
import OrderProvider from './_provider/orderIdProvider';
import { cartReducer, initialState } from './_reducer/CartReducer';
import { ModalProvider } from './_reducer/ModalProvider';
import { SearchProvider } from './_reducer/SearchContext';
import getAddManager from './_utils/getAddManager';
import { getSiteSettings } from './_utils/getSiteSettings';
import './globals.css';

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '800'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
});

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const [siteSetting, setSiteSetting] = useState(null);
    const [addManager, setAddManager] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [lang, setLang] = useState('en');

    useEffect(() => {
        // Initialize visibility state only once when component mounts
        const initializeVisibility = () => {
            if (typeof window === 'undefined') return;

            const hasVisited = sessionStorage.getItem('homeVisited');

            if (!hasVisited && pathname === '/') {
                setIsVisible(true);
                sessionStorage.setItem('homeVisited', 'true');
            }
        };

        initializeVisibility();

        // Cleanup function
        return () => {
            if (pathname !== '/') {
                setIsVisible(false);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const siteSettings = await getSiteSettings();
                const addManagerData = await getAddManager();
                setSiteSetting(siteSettings.data);
                setAddManager(addManagerData);

                setTimeout(() => {
                    setIsLoading(false);
                    setHasLoaded(true);
                }, 1000);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        dispatch({
            type: 'SET_CART',
        });
    }, []);

    return (
        <html>
            {addManager?.tag_manager_id &&
                Array.isArray(addManager?.tag_manager_id) &&
                addManager?.tag_manager_id.map((gtmId) => (
                    <GoogleTagManager
                        key={gtmId}
                        gtmId={gtmId}
                    />
                ))}
            <body>
                    <TemplateProvider>
                        <LanguageProvider>
                            <UserProvider>
                                <AdProvider>
                                    <ProductContext.Provider
                                        value={{ state, dispatch }}
                                    >
                                        <SearchProvider>
                                            <SortProvider>
                                                <BrandProvider>
                                                    <ModalProvider>
                                                        <SiteSettingProvider>
                                                            <OrderProvider>
                                                                <NextTopLoader
                                                                    color="#8831E1"
                                                                    initialPosition={
                                                                        0.08
                                                                    }
                                                                    crawlSpeed={
                                                                        200
                                                                    }
                                                                    height={
                                                                        3
                                                                    }
                                                                    crawl={
                                                                        true
                                                                    }
                                                                    showSpinner={
                                                                        false
                                                                    }
                                                                    easing="ease"
                                                                    speed={
                                                                        200
                                                                    }
                                                                    shadow="0 0 10px #8831E1,0 0 5px #8831E1"
                                                                    zIndex={
                                                                        99999999999999
                                                                    }
                                                                />
                                                                <main>
                                                                    {pathname ===
                                                                        '/' && (
                                                                        <div>
                                                                            {isVisible && (
                                                                                <Announcement />
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {
                                                                        children
                                                                    }
                                                                </main>
                                                                <ScrollToTop />
                                                                <div className="fixed z-[99999999] grid gap-3 md:gap-2 bottom-10 md:bottom-[85px] right-4 sm:right-4">
                                                                    {siteSetting?.whatsapp_id &&
                                                                        pathname !==
                                                                            '/pos' && (
                                                                            <Link
                                                                                className="w-10 h-10 overflow-hidden md:w-9 md:h-9"
                                                                                target="_blank"
                                                                                href={`https://wa.me/${siteSetting.whatsapp_id}`}
                                                                            >
                                                                                <Image
                                                                                    className="w-full h-full"
                                                                                    src={
                                                                                        whatsapp
                                                                                    }
                                                                                    alt="whatsapp"
                                                                                    priority
                                                                                />
                                                                            </Link>
                                                                        )}
                                                                    {siteSetting?.fb_page_id &&
                                                                        pathname !==
                                                                            '/pos' && (
                                                                            <Link
                                                                                className="w-10 h-10 overflow-hidden md:w-9 md:h-9"
                                                                                target="_blank"
                                                                                href={`https://m.me/${siteSetting.fb_page_id}`}
                                                                            >
                                                                                <Image
                                                                                    className="w-full h-full"
                                                                                    src={
                                                                                        messanger
                                                                                    }
                                                                                    alt="messanger"
                                                                                    priority
                                                                                />
                                                                            </Link>
                                                                        )}
                                                                </div>
                                                                <ToastContainer />
                                                            </OrderProvider>
                                                        </SiteSettingProvider>
                                                    </ModalProvider>
                                                </BrandProvider>
                                            </SortProvider>
                                        </SearchProvider>
                                    </ProductContext.Provider>
                                </AdProvider>
                            </UserProvider>
                        </LanguageProvider>
                    </TemplateProvider>

                {addManager?.pixels &&
                    Array.isArray(addManager?.pixels) &&
                    addManager?.pixels.map((pixel) => (
                        <div key={pixel.id}>
                            <FBPixel
                                pixelId={pixel.pixel_id}
                            />
                            <FBConversionApi
                                pixelId={pixel.token}
                            />
                        </div>
                    ))}
            </body>
        </html>
    );
}
