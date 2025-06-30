'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import useUser from '@/_hooks/useUser';
import logo from '@/assets/icons/logo.svg';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { RxCross1 } from 'react-icons/rx';

// Lazy Imports
const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });
const AuthUser = dynamic(() => import('./AuthUser'), { ssr: false });
const HeaderCart = dynamic(() => import('./HeaderCart'), { ssr: false });
const HeaderSearch = dynamic(() => import('./HeaderSearch'), { ssr: false });
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), {
    ssr: false,
});

const Header = () => {
    const [showSearchModal, setShowSearchModal] = useState(false);
    const { siteSetting, loading } = useSiteSetting();
    const { dictionary } = useDictionary();
    const { user } = useUser();

    const handleSearch = () => {
        setShowSearchModal(!showSearchModal);
    };

    const { header_logo } = siteSetting;

    return (
        <header className="header py-[17px] bg-[#F4F4F4] border-b border-[#D1D1D1] min-h-[75px] md:min-h-[90px]">
            <div className="container">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className={`header-logo ${showSearchModal ? 'hidden' : 'block'}`}>
                        <Link href="/" className="inline-block max-w-[200px]">
                            {loading ? (
                                <div className="w-24 h-8 bg-white rounded-md sm:w-32 sm:h-10 md:w-40 md:h-11 animate-pulse" />
                            ) : (
                                <Image
                                    src={header_logo || logo}
                                    alt="logo"
                                    width={200}
                                    height={200}
                                    className="object-contain w-auto h-auto"
                                />
                            )}
                        </Link>
                    </div>

                    {/* Search Bar */}
                    {loading ? (
                        <div className="hidden w-32 bg-white rounded-full sm:block md:w-64 lg:w-80 h-9 md:h-10 animate-pulse" />
                    ) : (
                        <HeaderSearch
                            showSearchModal={showSearchModal}
                            setShowSearchModal={setShowSearchModal}
                            dictionary={dictionary.Header}
                        />
                    )}

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Language Switcher */}
                        {!showSearchModal &&
                            (loading ? (
                                <div className="w-10 h-8 bg-white rounded-full sm:w-14 sm:h-9 md:w-16 md:h-10 animate-pulse" />
                            ) : (
                                <LanguageSwitcher />
                            ))}

                        {/* Cart */}
                        {!showSearchModal &&
                            (loading ? (
                                <div className="w-10 h-8 bg-white rounded-full sm:w-16 sm:h-9 md:w-18 md:h-10 animate-pulse" />
                            ) : (
                                <HeaderCart dictionary={dictionary.Header} />
                            ))}

                        {/* Mobile Search Button */}
                        <button
                            type="button"
                            className="relative flex items-center justify-center text-lg md:text-[22px] text-gray-800 border border-[#D14BF8] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white lg:hidden"
                            onClick={handleSearch}
                            aria-label="search toggle button"
                        >
                            {showSearchModal ? <RxCross1 /> : <FiSearch />}
                        </button>

                        {/* Auth Button */}
                        <div className="flex items-center gap-4">
                            {loading ? (
                                <div className="hidden w-24 bg-white rounded-full md:block lg:w-28 h-9 lg:h-11 animate-pulse" />
                            ) : !user ? (
                                <AuthModal>
                                    <button
                                        type="button"
                                        aria-label="login button"
                                        className="flex items-center justify-center w-10 h-10 text-base text-white capitalize bg-purple-900 border border-purple-900 rounded-full md:px-5 md:py-3 md:rounded-md md:w-auto md:h-auto"
                                    >
                                        <span className="hidden md:block">
                                            {dictionary.Auth.signin}
                                        </span>
                                        <span className="md:hidden">
                                            <AiOutlineLogin />
                                        </span>
                                    </button>
                                </AuthModal>
                            ) : (
                                <AuthUser />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
