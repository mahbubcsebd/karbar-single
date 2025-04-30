'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import errorImg from '../app/assets/images/404.png';
import '../app/globals.css';
import logo from './assets/icons/logo.svg';


export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 7000);
    }, [router]);
    return (
        <html lang="en">
            <head>
                <title>404 | Page not found</title>
            </head>
            <body className="text-center">
                <header
                    id="header"
                    className="header py-[17px] bg-gray-300 fixed top-0 left-0 w-full"
                >
                    <div className="header-area">
                        <div className="container">
                            <div className="flex items-center justify-center header-content">
                                <Link href="/">
                                    <Image
                                        src={logo}
                                        alt="logo"
                                        className="w-[82px] lg:w-auto"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>
                <div>
                    <div className="container">
                        <div className="grid-cols-12 justify-center pt-[120px]">
                            <div className="col-span-8">
                                <div className="flex justify-center text-center mb-[44px]">
                                    <Image
                                        src={errorImg}
                                        alt="404"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-semibold text-gray-900 mb-3">
                                        404 - Page Not Found
                                    </h1>
                                    <p className="text-lg text-gray-700 font-normal mb-6">
                                        This page no longer exists or has been
                                        moved
                                    </p>
                                    <div className="flex justify-center">
                                        <Link
                                            href="/"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition-colors"
                                            aria-label="Return to homepage"
                                        >
                                            <span>Back to Homepage</span>
                                            <IoArrowForward aria-hidden="true" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
