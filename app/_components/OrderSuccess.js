"use client"

import useDictionary from "@/_hooks/useDictionary";
import useOrderId from '@/_hooks/useOrderId';
import useSiteSetting from '@/_hooks/useSiteSetting';
import logo from '@/assets/icons/logo.svg';
import successImg from "@/assets/icons/success.svg";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const OrderSuccess = ({ title }) => {
    const {language, dictionary} = useDictionary();
    const {orderId} = useOrderId();
    const { siteSetting, loading, error } = useSiteSetting();

    const { orderSuccess, orderThanks, orderIdText, shoppingMore } = dictionary.OrderSuccess;
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 20000);
    }, [router]);

    return (
        <>
            <header
                id="header"
                className="header py-[17px] bg-gray-300 fixed top-0 left-0 w-full"
            >
                <div className="header-area">
                    <div className="container">
                        <div className="flex items-center justify-center header-content">
                            <Link href="/" className='inline-block max-w-[200px'>
                                <Image
                                    src={siteSetting?.header_logo || logo}
                                    alt="logo"
                                    width={200}
                                    height={200}
                                    className="w-auto h-auto object-contain"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-6 md:pt-20 xxl:pt-0">
                    <div className="w-[120px] sm:w-[150px] md:w-auto">
                        <Image
                            src={successImg}
                            alt="success image"
                            className="flex justify-center mx-auto text-center"
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-center text-gray-700 sm:text-2xl lg:text-3xl">
                        {orderSuccess}
                    </h2>
                    {language === 'en' && (
                        <p className="text-base font-normal text-gray-700">
                            {orderThanks} {title} !!
                        </p>
                    )}
                    {language === 'bn' && (
                        <p className="text-base font-normal text-gray-700">
                            {title} {orderThanks}
                        </p>
                    )}

                    <p className="text-base font-normal text-gray-700">
                        {orderIdText}: <span className='inline-block font-semibold'>{orderId}</span>
                    </p>

                    <Link
                        href="/"
                        className="flex justify-center items-center gap-[6px] text-base text-white font-medium px-6 py-4 bg-black rounded-md"
                    >
                        {shoppingMore}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default OrderSuccess