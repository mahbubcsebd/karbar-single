"use client"

import useDictionary from '@/_hooks/useDictionary';
import { getAdvertisement } from '@/_utils/getAdvertisement';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Banner = () => {
    const {dictionary} = useDictionary();
    const [banner, setBanner] = useState([])

    useEffect(()=> {
            const fetchAdvertisement = async () => {
                try {
                    const advertisementData = await getAdvertisement("shop_top");
                    setBanner(advertisementData?.data || []);
                } catch (err) {
                    console.error('Error fetching advertisements:', err);
                }
            };
            fetchAdvertisement();
    },[])

    if (!banner || banner.length === 0) return null;

  return (
      <div className="banner">
          <div className="relative w-full banner-area">
              <Image
                  src={banner[0].images[0].image}
                  alt="banner page"
                  className="absolute top-0 left-0 z-10 object-cover w-full h-full"
                  width={1920}
                  height={300}
              />
              <div className="container">
                  <Link
                      href={banner[0].images[0].url}
                      className="flex justify-center items-center h-[150px] relative z-20 w-full"
                  >
                      <h2 className="text-2xl font-semibold text-white capitalize md:text-4xl">
                          {/* {dictionary.Banner.shopBanner} */}
                          {banner[0].name}
                      </h2>
                  </Link>
              </div>
          </div>
      </div>
  );
}

export default Banner