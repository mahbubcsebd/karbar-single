'use client';

import useSiteSetting from '@/_hooks/useSiteSetting';
import {
    renderBlock1Image,
    renderBlock2Images,
    renderBlock3Images,
    renderBlock4Images,
} from '@/_utils/advertisementLayout';
import { getAdvertisement } from '@/_utils/getAdvertisement';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Advertisement = ({ position }) => {
    const { siteSetting, loading, error } = useSiteSetting();
    const [advertisements, setAdvertisements] = useState([]);

    useEffect(() => {
        if (!siteSetting?.module?.includes('advertisement')) return;

        const fetchAdvertisement = async () => {
            try {
                const advertisementData = await getAdvertisement(position);
                setAdvertisements(advertisementData?.data || []);
            } catch (err) {
                console.error('Error fetching advertisements:', err);
            }
        };
        fetchAdvertisement();
    }, [siteSetting?.module, position]);

    if (loading) {
        return (
            <div className="bg-white py-[60px]">
                <div className="container grid grid-cols-12 items-stretch gap-4 min-h-[400px]">
                    <div className="grid h-full col-span-4 grid-rows-2 gap-4">
                        <div className="h-full bg-gray-300 animate-pulse"></div>
                        <div className="h-full bg-gray-300 animate-pulse"></div>
                    </div>
                    <div className="col-span-8">
                        <div className="h-full bg-gray-300 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">Error loading advertisements.</p>;
    }

    if (!advertisements.length) return null;

    return (
        <div className="py-[60px]">
            {advertisements.map((ad) => {
                const containerClass = ad.container ? 'container mx-auto' : '';
                const gapClass = ad.gap ? 'gap-4' : '';

                return (
                    <div
                        key={ad.id}
                        className={`${containerClass} grid grid-cols-12 items-stretch ${gapClass}`}
                    >
                        {ad.block_style === 'block_1' &&
                        ad.layout === 'layout_1'
                            ? renderBlock1Image(ad, ad.gap, position)
                            : ad.block_style === 'block_2'
                            ? renderBlock2Images(ad, ad.gap, position)
                            : ad.block_style === 'block_3'
                            ? renderBlock3Images(ad, ad.gap, position)
                            : ad.block_style === 'block_4'
                            ? renderBlock4Images(ad, ad.gap, position)
                            : ad.images.map((imageData, index) => (
                                  <Link
                                      key={index}
                                      href={imageData.url}
                                      className="relative block col-span-12 overflow-hidden bg-gray-100"
                                      target="_blank"
                                  >
                                      <Image
                                          src={imageData.image}
                                          alt={
                                              imageData.alt ||
                                              `Advertisement ${index + 1}`
                                          }
                                          width={1000}
                                          height={600}
                                          className="object-cover w-full h-full"
                                          priority={position === 'home_top'}
                                          loading={
                                              position === 'home_top'
                                                  ? 'eager'
                                                  : 'lazy'
                                          }
                                          quality={75}
                                      />
                                  </Link>
                              ))}
                    </div>
                );
            })}
        </div>
    );
};

export default Advertisement;
