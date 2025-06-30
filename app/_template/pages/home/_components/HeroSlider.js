'use client';

import { getHeroImage } from '@/_utils/getHeroImage';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'swiper/css/bundle';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './hero.css';

const HeroSlider = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const heroImages = await getHeroImage();
        setImages(heroImages.data);
      } catch {
        console.log('Hero slide image fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  if (!loading && images.length < 1) {
    return null;
  }

  return (
    <div id="hero" className="hero">
      <div className="hero-area">
        <div className="hero-slider-container relative w-full h-[120px] md:h-[320px] lg:h-[370px] overflow-hidden">
          {loading || !images.length ? (
            <div className="w-full h-full bg-gray-300 animate-pulse" />
          ) : (
            <Swiper
              spaceBetween={0}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              effect={'fade'}
              navigation={true}
              pagination={{ clickable: true }}
              modules={[EffectFade, Navigation, Pagination, Autoplay]}
              className="mySwiper"
            >
              {images.map((img, index) => (
                <SwiperSlide key={img.id}>
                  <Link
                    href={img.url}
                    aria-label={`View details for ${img.title}`}
                  >
                    <div className="relative w-full h-[120px] md:h-[320px] lg:h-[370px]">
                      <Image
                        src={img.image_url}
                        alt={img.title}
                        fill
                        className="object-cover w-full h-full"
                        priority={index === 0}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        quality={100}
                      />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
