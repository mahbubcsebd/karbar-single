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
    const [pages, setPages] = useState([]);
    const { language, dictionary } = useDictionary();
    const { siteSetting, loading, error } = useSiteSetting();

    const fetchPaymentMethod = useCallback(async () => {
        try {
            const paymentMethodData = await getPaymentMethod();
            setPaymentMethod(paymentMethodData.data);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    }, []);

    const fetchPages = useCallback(async () => {
        try {
            const response = await getPages();
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethod();
        fetchPages();
    }, [fetchPaymentMethod, fetchPages]);

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

    // Memoize the payment icons for performance optimization
    const paymentIcons = useMemo(() => ({
        'bkash': bkashIcon,
        'nagad': nagadIcon,
        'cash': codIcon
    }), []);

    // Memoize the social links
    const socialLinks = useMemo(() => [
        { name: 'facebook', url: facebook_url, icon: FaFacebookF },
        { name: 'instagram', url: instagram_url, icon: FaInstagram },
        { name: 'youtube', url: youtube_url, icon: FaYoutube },
        { name: 'tiktok', url: tiktok_url, icon: FaTiktok },
    ], [facebook_url, instagram_url, youtube_url, tiktok_url]);

    return (
        <footer id="footer" className="bg-[#14004F] footer relative overflow-hidden">
            <Image
                className="absolute bottom-0 left-0 w-full"
                src={footerBg}
                alt="footer-bg z-10"
                priority
            />
            <div className="footer-area relative z-50">
                <div className="container">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-4 py-[60px]">
                        <div>
                            <div className="mb-6 max-w-[200px] max-h-[56px]">
                                <Link href="/">
                                    <Image
                                        src={footer_logo || logo}
                                        alt="footer logo"
                                        height={115}
                                        width={115}
                                        className="max-w-[115px] lg:max-w-[200px] md:w-auto h-auto max-h-[56px]"
                                        loading="lazy"
                                        quality={60}
                                    />
                                </Link>
                            </div>
                            <p className="text-base text-gray-300 font-normal mb-6 max-w-[310px]">
                                {footer_description}
                            </p>
                            <ul className="flex items-center gap-[18px]">
                                {socialLinks.map(({ name, url, icon: Icon }) =>
                                    url && (
                                        <li key={name}>
                                            <Link href={url} rel="noopener noreferrer" target="_blank" aria-label={`${name} url`}>
                                                <div className="flex items-center justify-center w-10 h-10 text-lg text-white transition duration-150 border-2 border-white rounded-full hover:bg-purple-900 hover:border-purple-900">
                                                    <Icon />
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[20px] text-white font-semibold mb-6 md:mb-[30px]">
                                {company}
                            </h3>
                            <ul className="grid gap-4 md:gap-6">
                                {pages.map((page) => (
                                    <li key={page.id}>
                                        <Link className="text-lg font-normal text-gray-400" href={`/company/${page.slug}`}>
                                            {page.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[20px] text-white font-semibold mb-6 md:mb-[30px]">
                                {contact}
                            </h3>
                            <ul className="grid gap-4 md:gap-6">
                                <li>
                                    <div className="flex items-center gap-2 text-base font-normal text-gray-300 lg:text-lg">
                                        <div>
                                            <span className="w-[34px] h-[34px] rounded-full bg-gray-200 flex justify-center items-center text-gray-900">
                                                <FiPhoneCall />
                                            </span>
                                        </div>
                                        {phone || '01896-088855'}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center gap-2 text-base font-normal text-gray-300 lg:text-lg">
                                        <div>
                                            <span className="w-[34px] h-[34px] rounded-full bg-gray-200 flex justify-center items-center text-gray-900">
                                                <CiMail />
                                            </span>
                                        </div>
                                        {email || 'karbar@gmail.com'}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center gap-2 text-base font-normal text-gray-300 lg:text-lg">
                                        <div>
                                            <span className="w-[34px] h-[34px] rounded-full bg-gray-200 flex justify-center items-center text-gray-900">
                                                <CiLocationOn />
                                            </span>
                                        </div>
                                        {footer_address || 'Mirpur DOHS, Dhaka'}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-600" />
                <div className="container">
                    <div className="lg:flex justify-between items-center py-[30px] hidden">
                        <p className="text-base lg:text-lg font-normal text-gray-500 flex items-center gap-[4px]">
                            &copy; All rights reserved by <span className="font-semibold">{title}</span>
                        </p>
                        <p className="text-base lg:text-lg font-normal text-gray-500 flex items-center gap-[4px]">
                            Powered by{' '}
                            <Link className="text-gray-400" href="https://karbar.shop" target="_blank">
                                <Image src={karbar} alt="karbar" className="w-[65px] lg:w-[70px] pt-[4px]" loading="lazy" quality={60} width={70} height={30} />
                            </Link>
                        </p>
                        {paymentMethod.length > 0 && (
                            <div className="flex items-center gap-4">
                                <p className="text-[20px] font-normal text-gray-400 relative">{payment} :</p>
                                <ul className="flex items-center gap-2">
                                    {paymentMethod.map((method) => {
                                        const icon = paymentIcons[method.name];
                                        return (
                                            <li key={method.id}>
                                                <Image src={icon} alt={method.name} loading="lazy" quality={60} width={50} height={50} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:hidden">
                    {paymentMethod.length > 0 && (
                        <div className="border-b border-gray-600 py-[18px]">
                            <div className="flex flex-col items-center gap-4 lg:flex-row">
                                <p className="text-[20px] font-normal text-gray-400 flex flex-col gap-1 justify-center items-center lg:hidden">
                                    {payment} :
                                    <span className="w-9 h-[1px] bg-[#FF9E2C] "></span>
                                </p>
                                <ul className="flex items-center gap-2">
                                    {paymentMethod.map((method) => {
                                        const icon = paymentIcons[method.name];
                                        return (
                                            <li key={method.id}>
                                                <Image src={icon} alt={method.name} loading="lazy" quality={60} width={50} height={50} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
