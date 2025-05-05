'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import useUser from '@/_hooks/useUser';
import logo from '@/assets/icons/logo.svg';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';

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
  const router = useRouter();

  const handleSearch = () => {
    setShowSearchModal(!showSearchModal);
  };

  const handleProtectedRoute = (href) => {
    if (!user) {
      toast.error(`Please login first`, {
        position: 'bottom-right',
      });
    } else {
      router.push(href);
    }
  };

  const { header_logo, isRoundedLogo = true } = siteSetting;

  return (
    <>
      {/* Top Bar */}
      <div className="header-top bg-[#17AF26]">
        <div className="container">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3 py-5">
              <button
                onClick={() =>
                  handleProtectedRoute(`/dashboard/user/${user?.username}`)
                }
                className="text-base font-semibold text-white cursor-pointer"
              >
                My Account
              </button>
              <p className="text-base font-semibold text-white">|</p>
              <button
                onClick={() => handleProtectedRoute('/')}
                className="text-base font-semibold text-white cursor-pointer"
              >
                Flash Sale
              </button>
              <p className="text-base font-semibold text-white">|</p>
              <button
                onClick={() => handleProtectedRoute('/dashboard/my-orders')}
                className="text-base font-semibold text-white cursor-pointer"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="header py-2 bg-[#E8F7E9] border-b border-[#E8F7E9]">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className={`header-logo ${showSearchModal ? 'hidden' : 'block'}`}>
              <Link href="/" className="inline-block max-w-[200px]">
                {loading ? (
                  <div className="w-40 h-10 bg-white rounded-md animate-pulse" />
                ) : (
                  <Image
                    src={header_logo || logo}
                    alt="logo"
                    width={200}
                    height={200}
                    className={`object-contain w-auto h-auto ${
                      isRoundedLogo ? 'rounded-full' : ''
                    }`}
                  />
                )}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <HeaderSearch
                showSearchModal={showSearchModal}
                setShowSearchModal={setShowSearchModal}
                dictionary={dictionary.Header}
              />

              <div className="flex items-center gap-2 md:gap-4">
                {!showSearchModal && <LanguageSwitcher />}

                {/* Mobile Search Icon */}
                <button
                  type="button"
                  className="relative flex items-center justify-center text-lg md:text-[22px] text-gray-800 lg:border lg:border-[#D14BF8] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white lg:hidden"
                  onClick={handleSearch}
                  aria-label="search toggle button"
                >
                  {showSearchModal ? <RxCross1 /> : <FiSearch />}
                </button>

                {/* Auth Button or User Info */}
                <div className="flex items-center gap-4">
                  {!user ? (
                    <AuthModal>
                      <button
                        type="button"
                        aria-label="login button"
                        className="flex items-center text-sm text-[#74787C] font-bold justify-center w-10 h-10 md:px-10 md:py-4 md:h-[50px] md:w-auto capitalize bg-white border border-white rounded-full"
                      >
                        <span className="hidden md:block">
                          {dictionary.Auth.loginOrReg}
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

              {/* Cart */}
              {!showSearchModal && <HeaderCart dictionary={dictionary.Header} />}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
