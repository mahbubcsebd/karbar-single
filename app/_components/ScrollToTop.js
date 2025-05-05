"use client"

import topArrow from "@/assets/icons/top-arrow.svg";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LuArrowUpFromLine } from 'react-icons/lu';

function ScrollToTop() {
    const [showScroll, setShowScroll] = useState(false);

    const handleScroll = () => {
        if (window.pageYOffset > 400) {
            setShowScroll(true);
        } else {
            setShowScroll(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed right-4 bottom-[35px] z-999999999 hidden md:block">
            {showScroll && (
                <button
                    onClick={scrollToTop}
                    className="w-10 h-10 overflow-hidden md:w-9 md:h-9"
                >
                    <Image
                        src={topArrow}
                        alt="top arrow"
                    />
                    <LuArrowUpFromLine />
                </button>
            )}
        </div>
    );
}

export default ScrollToTop;
