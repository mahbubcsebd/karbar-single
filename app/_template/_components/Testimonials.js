'use client';

import useDictionary from '@/_hooks/useDictionary';
import { getTestimonials } from '@/_utils/getTestimonial';
import latestbg from '@/assets/images/latest-bg.svg';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SectionTitle from './SectionTitle';
import TestimonialCard from './TestimonialCard';

const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

const Testimonials = ({ bg }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dictionary } = useDictionary();

    useEffect(() => {
        const fetchTestimonials = debounce(async () => {
            try {
                const testimonialsData = await getTestimonials();
                setTestimonials(testimonialsData.data);
            } catch (err) {
                console.error('Error fetching testimonials:', err);
                setError(
                    'Failed to load testimonials. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        }, 300);

        fetchTestimonials();
    }, []);

    const swiperSettings = useMemo(
        () => ({
            spaceBetween: 30,
            slidesPerView: Math.min(testimonials.length, 3),
            loop: testimonials.length >= 3,
            autoplay: { delay: 4000, pauseOnMouseEnter: true },
            pagination: { clickable: true },
            breakpoints: {
                320: {
                    slidesPerView: Math.min(testimonials.length, 1),
                    spaceBetween: 16,
                },
                768: {
                    slidesPerView: Math.min(testimonials.length, 2),
                    spaceBetween: 20,
                },
                1280: {
                    slidesPerView: Math.min(testimonials.length, 3),
                    spaceBetween: 30,
                },
            },
            modules: [Pagination, Autoplay, Thumbs],
            className: 'testimonialsSwiper',
        }),
        [testimonials]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <span className="text-gray-400 animate-pulse">
                    Loading testimonials...
                </span>
            </div>
        );
    }

    if (error) {
        return <div className="py-10 text-center text-red-500">{error}</div>;
    }

    if (testimonials.length < 3) {
        return null;
    }

    return (
        <div className={`${bg ? '' : 'mb-10'} review-section`}>
            <div className={`relative review-area ${bg ? 'py-16' : ''}`}>
                {bg && (
                    <Image
                        src={latestbg}
                        alt="background"
                        className="absolute top-0 left-0 z-[-1] w-full h-full object-cover object-center"
                        loading="lazy"
                    />
                )}
                <div className="container">
                    <SectionTitle
                        title={dictionary.Testimonial.testimonialTitle}
                    />
                    <div className="flex items-stretch review-slider-wrapper">
                        <Swiper {...swiperSettings}>
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="h-full"
                                >
                                    <div className="h-full pb-12">
                                        <TestimonialCard
                                            testimonial={testimonial}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
