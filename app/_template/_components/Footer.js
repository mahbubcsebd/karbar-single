'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import getPages from '@/_utils/getPages';
import { getPaymentMethod } from '@/_utils/getPaymentMethod';
import bkashIcon from '@/assets/icons/bkash.svg';
import codIcon from '@/assets/icons/cod.svg';
import logo from '@/assets/icons/footer-logo.svg';
import karbar from '@/assets/icons/karbar-logo.svg';
import nagadIcon from '@/assets/icons/nagad.svg';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [pages, setPages] = useState([]);
  const { language, dictionary } = useDictionary();
  const { siteSetting, loading } = useSiteSetting();

  useEffect(() => {
    getPaymentMethod()
      .then((res) => setPaymentMethod(res.data))
      .catch((err) => console.error('Payment Error', err));
    getPages()
      .then((res) => setPages(res.data))
      .catch((err) => console.error('Pages Error', err));
  }, []);

  const {
    contact,
    footerDesc,
    company,
    aboutUs,
    privacyPolicy,
    returnPolicy,
    termsAndConditions,
    copyRight,
    payment,
  } = dictionary.Footer;

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
    <footer className="relative overflow-hidden bg-gray-900">
      <div className="relative z-50">
        {/* Top Row with Logo and Socials */}
        <div className="py-[30px] border-b border-white/10">
          <div className="container flex items-center justify-between">
            <div className="max-w-[200px]">
              {loading ? (
                <div className="w-[180px] h-[50px] bg-white/10 animate-pulse rounded-md" />
              ) : (
                <Link href="/" className="inline-block">
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
                        <div className="text-lg text-white">
                          <Icon />
                        </div>
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>

        {/* Dynamic Pages & Payments */}
        <div className="container text-center">
          {/* Pages */}
          <ul className="flex items-center justify-center gap-4 md:gap-[18px] py-[30px] flex-wrap">
            {pages.length > 0 ? (
              pages.map((page, index) => (
                <React.Fragment key={page.id}>
                  <li>
                    <Link
                      className="text-base font-normal text-white"
                      href={`/company/${page.slug}`}
                    >
                      {page.title}
                    </Link>
                  </li>
                  {index !== pages.length - 1 && (
                    <li className="text-xs font-normal text-white">/</li>
                  )}
                </React.Fragment>
              ))
            ) : (
              <li className="w-40 h-4 rounded bg-white/10 animate-pulse" />
            )}
          </ul>

          {/* Payment Methods */}
          <div className="flex items-center justify-center gap-4 pb-[30px]">
            <p className="text-base font-medium text-white">{payment} :</p>
            {paymentMethod.length > 0 ? (
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
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="w-[220px] h-[34px] bg-white/10 animate-pulse rounded" />
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="container">
          <hr className="border-white/10" />
          <div className="flex flex-col lg:flex-row justify-between items-center py-[30px] gap-3">
            <p className="text-sm font-normal text-white flex items-center gap-[4px]">
              &copy; All rights reserved by{' '}
              <span className="font-semibold">
                {loading ? (
                  <span className="inline-block w-20 h-4 rounded bg-white/10 animate-pulse" />
                ) : (
                  title
                )}
              </span>
            </p>
            <p className="text-sm font-normal text-white flex items-center gap-[4px]">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
