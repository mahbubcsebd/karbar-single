'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import getPages from '@/_utils/getPages';
import { getPaymentMethod } from '@/_utils/getPaymentMethod';
import bkashIcon from '@/assets/icons/bkash.svg';
import codIcon from '@/assets/icons/cod.svg';
import footerBg from '@/assets/icons/footer-bg.svg';
import logo from '@/assets/icons/footer-logo.svg';
import karbar from '@/assets/icons/karbar-logo.svg';
import nagadIcon from '@/assets/icons/nagad.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiLocationOn, CiMail } from 'react-icons/ci';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';

const Footer = () => {
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);

  const { language, dictionary } = useDictionary();
  const { siteSetting, loading } = useSiteSetting();

  const fetchPaymentMethod = useCallback(async () => {
    setIsLoadingPayment(true);
    try {
      const res = await getPaymentMethod();
      setPaymentMethod(res.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setIsLoadingPayment(false);
    }
  }, []);

  const fetchPages = useCallback(async () => {
    setIsLoadingPages(true);
    try {
      const res = await getPages();
      setPages(res.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoadingPages(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethod();
    fetchPages();
  }, [fetchPaymentMethod, fetchPages]);

  const { contact, company, payment } = dictionary.Footer;

  const {
    title,
    footer_logo,
    phone,
    email,
    footer_address,
    facebook_url,
    instagram_url,
    youtube_url,
    tiktok_url,
    footer_description,
  } = siteSetting;

  const paymentIcons = useMemo(
    () => ({
      bkash: bkashIcon,
      nagad: nagadIcon,
      cash: codIcon,
    }),
    []
  );

  const socialLinks = useMemo(
    () => [
      { name: 'facebook', url: facebook_url, icon: FaFacebookF },
      { name: 'instagram', url: instagram_url, icon: FaInstagram },
      { name: 'youtube', url: youtube_url, icon: FaYoutube },
      { name: 'tiktok', url: tiktok_url, icon: FaTiktok },
    ],
    [facebook_url, instagram_url, youtube_url, tiktok_url]
  );

  return (
    <footer
      id="footer"
      className="bg-[#14004F] footer relative overflow-hidden"
    >
      <Image
        className="absolute bottom-0 left-0 w-full"
        src={footerBg}
        alt="footer-bg"
        priority
      />
      <div className="relative z-50 footer-area">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-4 py-[60px]">
            {/* Column 1: Logo and Social */}
            <div>
              <div className="mb-6">
                {loading ? (
                  <div className="w-[180px] h-[50px] bg-white/10 animate-pulse rounded-md" />
                ) : (
                  <Link href="/" className="inline-block max-w-[200px]">
                    <Image
                      src={footer_logo || logo}
                      alt="footer logo"
                      width={200}
                      height={200}
                      className="object-contain w-auto h-auto"
                      loading="lazy"
                      quality={60}
                    />
                  </Link>
                )}
              </div>
              <div className="text-base text-gray-300 font-normal mb-6 max-w-[310px]">
                {loading ? (
                  <div className="w-[250px] h-[20px] bg-white/10 animate-pulse rounded mb-2" />
                ) : (
                  footer_description
                )}
              </div>
              <ul className="flex items-center gap-[18px]">
                {socialLinks.map(
                  ({ name, url, icon: Icon }) =>
                    url && (
                      <li key={name}>
                        <Link
                          href={url}
                          rel="noopener noreferrer"
                          target="_blank"
                          aria-label={`${name} url`}
                        >
                          <div className="flex items-center justify-center w-10 h-10 text-lg text-white transition duration-150 border-2 border-white rounded-full hover:bg-purple-900 hover:border-purple-900">
                            <Icon />
                          </div>
                        </Link>
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* Column 2: Company Pages */}
            <div>
              <h3 className="text-[20px] text-white font-semibold mb-6 md:mb-[30px]">
                {company}
              </h3>
              <ul className="grid gap-4 md:gap-6">
                {isLoadingPages
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <li
                        key={i}
                        className="w-[160px] h-4 bg-white/10 animate-pulse rounded"
                      />
                    ))
                  : pages.map((page) => (
                      <li key={page.id}>
                        <Link
                          className="text-lg font-normal text-gray-400"
                          href={`/company/${page.slug}`}
                        >
                          {page.title}
                        </Link>
                      </li>
                    ))}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h3 className="text-[20px] text-white font-semibold mb-6 md:mb-[30px]">
                {contact}
              </h3>
              <ul className="grid gap-4 md:gap-6">
                {[phone, email, footer_address].map((info, idx) => (
                  <li key={idx}>
                    <div className="flex items-center gap-2 text-base font-normal text-gray-300 lg:text-lg">
                      <span className="w-[34px] h-[34px] rounded-full bg-gray-200 flex justify-center items-center text-gray-900">
                        {idx === 0 ? (
                          <FiPhoneCall />
                        ) : idx === 1 ? (
                          <CiMail />
                        ) : (
                          <CiLocationOn />
                        )}
                      </span>
                      {loading ? (
                        <span className="inline-block w-[160px] h-4 bg-white/10 animate-pulse rounded" />
                      ) : (
                        info ||
                        [
                          '01896-088855',
                          'karbar@gmail.com',
                          'Mirpur DOHS, Dhaka',
                        ][idx]
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Bottom Section */}
        <hr className="border-gray-600" />
        <div className="container">
          <div className="lg:flex justify-between items-center py-[30px] hidden">
            <p className="text-base lg:text-lg font-normal text-gray-500 flex items-center gap-[4px]">
              &copy; All rights reserved by{' '}
              <span className="font-semibold">
                {loading ? (
                  <span className="inline-block w-20 h-4 rounded bg-white/10 animate-pulse" />
                ) : (
                  title
                )}
              </span>
            </p>
            <p className="text-base lg:text-lg font-normal text-gray-500 flex items-center gap-[4px]">
              Powered by{' '}
              <Link
                className="text-gray-400"
                href="https://karbar.shop"
                target="_blank"
              >
                <Image
                  src={karbar}
                  alt="karbar"
                  className="w-[65px] lg:w-[70px] pt-[4px]"
                  loading="lazy"
                  quality={60}
                  width={70}
                  height={30}
                />
              </Link>
            </p>

            {/* Payment Section */}
            <div className="flex items-center gap-4">
              <p className="text-[20px] font-normal text-gray-400">
                {payment} :
              </p>
              {isLoadingPayment ? (
                <div className="w-[220px] h-[34px] bg-white/10 animate-pulse rounded" />
              ) : (
                <ul className="flex items-center gap-2">
                  {paymentMethod.map((method) => {
                    const icon = paymentIcons[method.name];
                    return (
                      <li key={method.id}>
                        <Image
                          src={icon}
                          alt={method.name}
                          loading="lazy"
                          quality={60}
                          width={70}
                          height={34}
                          className="object-contain w-[50px] sm:w-[60px] lg:w-[80px] h-auto"
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
