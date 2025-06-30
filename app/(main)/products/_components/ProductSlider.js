'use client';

import VideoPlayer from '@/_components/VideoPlayer';
import useAdManager from '@/_hooks/useAdManager';
import { trackEvent } from '@/_utils/facebookPixel';
import noAvailable from '@/assets/icons/no-available.svg';
import youtube from '@/assets/icons/youtube-lg.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageMagnifier from './ImageMagnifier';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './productSlider.css';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';

const ProductSlider = ({ product, previewStyle }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { product_images, video_link } = product;
  const { adManager } = useAdManager();

  // For Google tag manager
  useEffect(() => {
    if (adManager?.tag_managers?.length > 0) {
      adManager.tag_managers.forEach((tagManager) => {
        if (tagManager.tag_manager_id) {
          window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
              items: product,
            },
          });
        }
      });
    }

    // For Facebook Pixels
    if (adManager?.pixels?.length > 0) {
      adManager.pixels.forEach((pixel) => {
        if (pixel.pixel_id) {
          trackEvent('View Item', product);
        }
      });
    }
  }, [product, adManager]);

  return (
    <div className="product-slider">
      {product_images && product_images.length > 0 ? (
        <div
          className={`w-full lg:rounded-[30px] overflow-hidden mb-4 ${
            previewStyle === 'landscape'
              ? 'h-[260px] sm:h-[400px] md:h-[500px] lg:h-[300px] xl:h-[320px]: 2xl:h-[400px]'
              : 'h-[420px] sm:h-[600px] md:h-[880px] lg:h-[550px] xl:h-[530px]: 2xl:h-[620px]'
          }`}
        >
          <Swiper
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            passiveListeners={true}
            className="w-full h-full"
          >
            {product_images.map((originalImg, index) => (
              <SwiperSlide key={index} className="relative">
                <div className="relative w-full h-full overflow-hidden">
                  <ImageMagnifier
                    src={originalImg.original_url}
                    width={400}
                    height={550}
                    zoomLevel={2.5}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <Image
          src={noAvailable}
          alt="hero slider"
          width={100}
          height={100}
          className="w-full h-full"
        />
      )}
      <div className="grid items-stretch grid-cols-12 gap-2 xxl:gap-3">
        {video_link && (
          <div className="h-full col-span-3">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className={`w-full overflow-hidden bg-white border border-gray-300 rounded-lg ${
                    previewStyle === 'landscape'
                      ? 'h-[78px] md:h-[104px] lg:h-[78px] xl:h-[104px]'
                      : 'h-full sm:h-[108px] lg:h-[108px] xl:h-[142px]'
                  }`}
                >
                  <Image
                    src={youtube}
                    alt="youtube"
                    width={100}
                    height={100}
                    className="object-contain w-full h-full rounded-lg xxl:object-cover"
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="min-w-[300px] h-[200px] sm:min-w-[550px] sm:h-[309px] md:min-w-[650px] md:h-[365px] xl:min-w-[970px] xl:h-[550px] iframe-wrapper p-0 b-0">
                <DialogHeader className="sr-only">
                  <DialogTitle>Video Modal</DialogTitle>
                  <DialogDescription>Video Modal</DialogDescription>
                </DialogHeader>
                <VideoPlayer videoUrl={video_link} />
              </DialogContent>
            </Dialog>
          </div>
        )}
        {product_images && (
          <div className={video_link ? 'col-span-9' : 'col-span-12'}>
            <div
              className={`slider-thumb ${
                previewStyle === 'landscape' ? 'landscape-thumb' : ''
              }`}
            >
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={video_link ? 3 : 4}
                freeMode={true}
                navigation={true}
                watchSlidesProgress={true}
                passiveListeners={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                {product_images.map((thumbImg, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={thumbImg.preview_url}
                      alt="preview slider"
                      width={150}
                      height={150}
                      className="w-full h-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSlider;
