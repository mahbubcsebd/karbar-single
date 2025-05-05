'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { RxCross1 } from 'react-icons/rx';
import logo from '../assets/icons/logo.svg';
import useDictionary from '../hooks/useDictionary';
import useSiteSetting from '../hooks/useSiteSetting';
import useUser from '../hooks/useUser';

// Lazy Imports
const AuthModal = dynamic(() => import('@/_templates/_components/AuthModal'), { ssr: false });
const AuthUser = dynamic(() => import('@/_templates/_components/AuthUser'), { ssr: false });
const HeaderCart = dynamic(() => import('@/_templates/_components/HeaderCart'), { ssr: false });
const HeaderSearch = dynamic(() => import('@/_templates/_components/HeaderSearch'), { ssr: false });
const LanguageSwitcher = dynamic(() => import('@/_templates/_components/LanguageSwitcher'),
  {
    ssr: false,
  }
);

const Header = () => {
    const [showSearchModal, setShowSearchModal] = useState(false);
    const { siteSetting } = useSiteSetting();
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
                    <div
                        className={`header-logo ${
                            showSearchModal ? 'hidden' : 'block'
                        }`}
                    >
                        <Link href="/">
                            <Image
                                src={header_logo ? header_logo : logo}
                                alt="logo"
                                width={100}
                                height={40}
                                className="max-w-[160px] lg:w-auto h-auto lg:max-w-[200px] max-h-[56px]"
                            />
                        </Link>
                    </div>
                    <HeaderSearch
                        showSearchModal={showSearchModal}
                        setShowSearchModal={setShowSearchModal}
                        dictionary={dictionary.Header}
                    />
                    <div className="flex items-center gap-2 md:gap-4">
                        {!showSearchModal && <LanguageSwitcher />}
                        {!showSearchModal && (
                            <HeaderCart dictionary={dictionary.Header} />
                        )}
                        <button
                            type="button"
                            className="relative flex items-center justify-center text-lg md:text-[22px] text-gray-800 border border-[#D14BF8] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white lg:hidden"
                            onClick={handleSearch}
                            aria-label="search toggle button"
                        >
                            {showSearchModal ? <RxCross1 /> : <FiSearch />}
                        </button>
                        <div className="flex items-center gap-4">
                            {!user ? (
                                <AuthModal>
                                    <button
                                        type="button"
                                        area-label="login button"
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
