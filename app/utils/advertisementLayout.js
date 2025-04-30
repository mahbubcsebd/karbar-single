import Image from "next/image";
import Link from "next/link";

// const layoutPatterns = {
//     block_1: {
//         layout_1: 'grid grid-cols-12 items-stretch',
//     },
//     block_2: {
//         layout_1: 'grid grid-cols-12 items-stretch',
//         layout_2: 'grid grid-cols-12 items-stretch',
//         layout_3: 'grid grid-cols-12 items-stretch',
//         layout_4: 'grid grid-cols-12 items-stretch',
//         layout_5: 'grid grid-cols-12 items-stretch',
//         layout_6: 'grid grid-cols-12 items-stretch',
//         layout_7: 'grid grid-cols-12 items-stretch',
//     },
//     block_3: {
//         layout_1: 'grid grid-cols-12 items-stretch', // 4/4/4
//         layout_2: 'grid grid-cols-12 items-stretch', // 8/2/2
//         layout_3: 'grid grid-cols-12 items-stretch', // 2/2/8
//         layout_4: 'grid grid-cols-12 items-stretch', // 4[2split]/8
//         layout_5: 'grid grid-cols-12 items-stretch', // 8/4[2split]
//         layout_6: 'grid grid-cols-12 items-stretch', // 6/3/3
//         layout_7: 'grid grid-cols-12 items-stretch', // 3/3/6
//         layout_8: 'grid grid-cols-12 items-stretch', // 6[2split]/6
//         layout_9: 'grid grid-cols-12 items-stretch', // 6/6[2split]
//         layout_10: 'grid grid-cols-12 items-stretch', // 9/3[2split]
//         layout_11: 'grid grid-cols-12 items-stretch', // 3[2split]/9
//         layout_12: 'grid grid-cols-12 items-stretch', // 7/5[2split]
//         layout_13: 'grid grid-cols-12 items-stretch', // 5[2split]/7
//     },
//     block_4: {
//         layout_1: 'grid grid-cols-12 items-stretch', // 3/3/3/3
//         layout_2: 'grid grid-cols-12 items-stretch', // 4/4/2/2
//         layout_3: 'grid grid-cols-12 items-stretch', // 2/2/4/4
//         layout_4: 'grid grid-cols-12 items-stretch', // 4/4/4[2split]
//         layout_5: 'grid grid-cols-12 items-stretch', // 4[2split]/4/4
//     },
// };

const getBlock2Layout = (layout, images) => {
    const layouts = {
        layout_1: ['col-span-12 lg:col-span-6 h-full', 'col-span-12 lg:col-span-6 h-full'], // 6/6
        layout_2: ['col-span-12 lg:col-span-5 h-full', 'col-span-12 lg:col-span-7 h-full'], // 5/7
        layout_4: ['col-span-12 lg:col-span-8 h-full', 'col-span-12 lg:col-span-4 h-full'], // 8/4
        layout_3: ['col-span-12 lg:col-span-7 h-full', 'col-span-12 lg:col-span-5 h-full'], // 7/5
        layout_5: ['col-span-12 lg:col-span-4 h-full', 'col-span-12 lg:col-span-8 h-full'], // 4/8
        layout_6: ['col-span-12 lg:col-span-3 h-full', 'col-span-12 lg:col-span-9 h-full'], // 3/9
        layout_7: ['col-span-12 lg:col-span-9 h-full', 'col-span-12 lg:col-span-3 h-full'], // 9/3
    };

    return layouts[layout] || layouts.layout_1;
};

const getBlock3Layout = (layout, images, gap) => {
    const gapClass = gap ? 'gap-4' : ''; // Determine gap class based on the gap value

    const layouts = {
        layout_1: images.map(() => `col-span-12 lg:col-span-4`), // 4/4/4
        layout_2: [
            `col-span-12 lg:col-span-12 xl:col-span-8 h-full`,
            `col-span-12 lg:col-span-6 xl:col-span-2 h-full`,
            `col-span-12 lg:col-span-6 xl:col-span-2 h-full`,
        ], // 8/2/2
        layout_3: [
            `col-span-12 lg:col-span-6 xl:col-span-2 h-full`,
            `col-span-12 lg:col-span-6 xl:col-span-2 h-full`,
            `col-span-12 lg:col-span-12 xl:col-span-8 h-full`,
        ], // 2/2/8
        layout_4: [
            // 4[2split]/8
            `col-span-12 lg:col-span-4 grid grid-rows-2 ${gapClass} h-full`,
            `col-span-12 lg:col-span-8 h-full`,
        ],
        layout_5: [
            // 8/4[2split]
            `col-span-12 lg:col-span-8 h-full`,
            `col-span-12 lg:col-span-4 grid grid-rows-2 ${gapClass} h-full`,
        ],
        layout_6: [
            `col-span-12 lg:col-span-6 h-full`,
            `col-span-12 lg:col-span-3 h-full`,
            `col-span-12 lg:col-span-3 h-full`,
        ], // 6/3/3
        layout_7: [
            `col-span-12 lg:col-span-3 h-full`,
            `col-span-12 lg:col-span-3 h-full`,
            `col-span-12 lg:col-span-6 h-full`,
        ], // 3/3/6
        layout_8: [
            // 6[2split]/6
            `col-span-12 lg:col-span-6 grid grid-rows-2 ${gapClass} h-full`,
            `col-span-12 lg:col-span-6 h-full`,
        ],
        layout_9: [
            // 6/6[2split]
            `col-span-12 lg:col-span-6 h-full`,
            `col-span-12 lg:col-span-6 grid grid-rows-2 ${gapClass} h-full`,
        ],
        layout_10: [
            // 9/3[2split]
            `col-span-12 lg:col-span-9 h-full`,
            `col-span-12 lg:col-span-3 grid grid-rows-2 ${gapClass} h-full`,
        ],
        layout_11: [
            // 3[2split]/9
            `col-span-12 lg:col-span-3 grid grid-rows-2 ${gapClass} h-full`,
            `col-span-12 lg:col-span-9 h-full`,
        ],
        layout_12: [
            // 7/5[2split]
            `col-span-12 lg:col-span-7 h-full`,
            `col-span-12 lg:col-span-5 grid grid-rows-2 ${gapClass} h-full`,
        ],
        layout_13: [
            // 5[2split]/7
            `col-span-12 lg:col-span-5 grid grid-rows-2 ${gapClass} h-full`,
            `col-span-12 lg:col-span-7 h-full`,
        ],
    };

    return layouts[layout] || layouts.layout_1;
};

const getBlock4Layout = (layout, images, gap) => {
    const gapClass = gap ? 'gap-4' : ''; // Determine gap class based on the gap value

    const layouts = {
        layout_1: [
            'col-span-12 lg:col-span-3 h-full',
            'col-span-12 lg:col-span-3 h-full',
            'col-span-12 lg:col-span-3 h-full',
            'col-span-12 lg:col-span-3 h-full',
        ], // 3/3/3/3
        layout_2: [
            'col-span-12 lg:col-span-4 h-full',
            'col-span-12 lg:col-span-4 h-full',
            'col-span-12 lg:col-span-2 h-full',
            'col-span-12 lg:col-span-2 h-full',
        ], // 4/4/2/2
        layout_3: [
            'col-span-12 lg:col-span-2 h-full',
            'col-span-12 lg:col-span-2 h-full',
            'col-span-12 lg:col-span-4 h-full',
            'col-span-12 lg:col-span-4 h-full',
        ], // 2/2/4/4
        layout_4: [
            // 4/4/4[2split]
            'col-span-12 lg:col-span-4 h-full',
            'col-span-12 lg:col-span-4 h-full',
            `col-span-12 lg:col-span-4 grid grid-rows-2 ${gapClass} h-full`,
        ],
        layout_5: [
            // 4[2split]/4/4
            `col-span-12 lg:col-span-4 grid grid-rows-2 ${gapClass} h-full`,
            'col-span-12 lg:col-span-4 h-full',
            'col-span-12 lg:col-span-4 h-full',
        ],
    };

    return layouts[layout] || layouts.layout_1;
};

const renderBlock1Image = (ad, gap, position) => {
    return (
        <Link
            href={ad.images[0].url}
            className="relative h-64 col-span-12 overflow-hidden bg-gray-100 md:h-80"
            target="_blank"
        >
            <Image
                src={ad.images[0].image}
                alt={ad.images[0].alt || 'Advertisement'}
                width={1000}
                height={600}
                className="object-cover w-full h-full"
                priority={position === 'home_top'}
                loading={position === 'home_top' ? 'eager' : 'lazy'}
                quality={75}
            />
        </Link>
    );
};

const renderBlock2Images = (ad, gap, position) => {
    const layout = getBlock2Layout(ad.layout, ad.images, gap);

    return ad.images.map((imageData, index) => (
        <Link
            key={index}
            href={imageData.url}
            className={`${layout[index]} relative overflow-hidden bg-gray-100`}
            target="_blank"
        >
            <Image
                src={imageData.image}
                alt={imageData.alt || `Advertisement ${index + 1}`}
                width={1000}
                height={600}
                className="object-cover w-full h-full"
                priority={position === 'home_top'}
                loading={position === 'home_top' ? 'eager' : 'lazy'}
                quality={75}
            />
        </Link>
    ));
};

const renderBlock3Images = (ad, gap, position) => {
    const layout = getBlock3Layout(ad.layout, ad.images, gap);

    if (
        [
            'layout_4',
            'layout_5',
            'layout_8',
            'layout_9',
            'layout_10',
            'layout_11',
            'layout_12',
            'layout_13',
        ].includes(ad.layout)
    ) {
        const isSplitFirst = [
            'layout_4',
            'layout_8',
            'layout_11',
            'layout_13',
        ].includes(ad.layout);
        const splitIndex = isSplitFirst ? 0 : 1;

        return (
            <>
                {isSplitFirst ? (
                    <>
                        <div className={layout[0]}>
                            <Link
                                href={ad.images[0].url}
                                className="h-full"
                                target="_blank"
                            >
                                <Image
                                    src={ad.images[0].image}
                                    alt={ad.images[0].alt || 'Advertisement 1'}
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
                            <Link
                                href={ad.images[1].url}
                                className="h-full"
                                target="_blank"
                            >
                                <Image
                                    src={ad.images[1].image}
                                    alt={ad.images[1].alt || 'Advertisement 2'}
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
                        </div>
                        <Link
                            href={ad.images[2].url}
                            className={layout[1]}
                            target="_blank"
                        >
                            <Image
                                src={ad.images[2].image}
                                alt={ad.images[2].alt || 'Advertisement 3'}
                                width={1000}
                                height={600}
                                className="object-cover w-full h-full"
                                priority={position === 'home_top'}
                                loading={
                                    position === 'home_top' ? 'eager' : 'lazy'
                                }
                                quality={75}
                            />
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href={ad.images[0].url}
                            className={layout[0]}
                            target="_blank"
                        >
                            <Image
                                src={ad.images[0].image}
                                alt={ad.images[0].alt || 'Advertisement 1'}
                                width={1000}
                                height={600}
                                className="object-cover w-full h-full"
                                priority={position === 'home_top'}
                                loading={
                                    position === 'home_top' ? 'eager' : 'lazy'
                                }
                                quality={75}
                            />
                        </Link>
                        <div className={layout[1]}>
                            <Link
                                href={ad.images[1].url}
                                className="h-full"
                                target="_blank"
                            >
                                <Image
                                    src={ad.images[1].image}
                                    alt={ad.images[1].alt || 'Advertisement 2'}
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
                            <Link
                                href={ad.images[2].url}
                                className="h-full"
                                target="_blank"
                            >
                                <Image
                                    src={ad.images[2].image}
                                    alt={ad.images[2].alt || 'Advertisement 3'}
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
                        </div>
                    </>
                )}
            </>
        );
    }

    return ad.images.map((imageData, index) => (
        <Link
            key={index}
            href={imageData.url}
            className={`${layout[index]} relative overflow-hidden bg-gray-100`}
            target="_blank"
        >
            <Image
                src={imageData.image}
                alt={imageData.alt || `Advertisement ${index + 1}`}
                width={1000}
                height={600}
                className="object-cover w-full h-full"
            />
        </Link>
    ));
};

const renderBlock4Images = (ad, gap, position) => {
    const layout = getBlock4Layout(ad.layout, ad.images);

    if (['layout_4', 'layout_5'].includes(ad.layout)) {
        const isSplitLast = ad.layout === 'layout_4';

        if (isSplitLast) {
            return (
                <>
                    <Link
                        href={ad.images[0].url}
                        className={layout[0]}
                        target="_blank"
                    >
                        <Image
                            src={ad.images[0].image}
                            alt={ad.images[0].alt || 'Advertisement 1'}
                            width={1000}
                            height={600}
                            className="object-cover w-full h-full"
                            priority={position === 'home_top'}
                            loading={position === 'home_top' ? 'eager' : 'lazy'}
                            quality={75}
                        />
                    </Link>
                    <Link
                        href={ad.images[1].url}
                        className={layout[1]}
                        target="_blank"
                    >
                        <Image
                            src={ad.images[1].image}
                            alt={ad.images[1].alt || 'Advertisement 2'}
                            width={1000}
                            height={600}
                            className="object-cover w-full h-full"
                            priority={position === 'home_top'}
                            loading={position === 'home_top' ? 'eager' : 'lazy'}
                            quality={75}
                        />
                    </Link>
                    <div className={layout[2]}>
                        <Link
                            href={ad.images[2].url}
                            className="h-full"
                            target="_blank"
                        >
                            <Image
                                src={ad.images[2].image}
                                alt={ad.images[2].alt || 'Advertisement 3'}
                                width={1000}
                                height={600}
                                className="object-cover w-full h-full"
                                priority={position === 'home_top'}
                                loading={
                                    position === 'home_top' ? 'eager' : 'lazy'
                                }
                                quality={75}
                            />
                        </Link>
                        <Link
                            href={ad.images[3].url}
                            className="h-full"
                            target="_blank"
                        >
                            <Image
                                src={ad.images[3].image}
                                alt={ad.images[3].alt || 'Advertisement 4'}
                                width={1000}
                                height={600}
                                className="object-cover w-full h-full"
                                priority={position === 'home_top'}
                                loading={
                                    position === 'home_top' ? 'eager' : 'lazy'
                                }
                                quality={75}
                            />
                        </Link>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className={layout[0]}>
                        <Link
                            href={ad.images[0].url}
                            className="h-full"
                            target="_blank"
                        >
                            <Image
                                src={ad.images[0].image}
                                alt={ad.images[0].alt || 'Advertisement 1'}
                                width={1000}
                                height={600}
                                className="object-cover w-full h-full"
                            />
                        </Link>
                        <Link
                            href={ad.images[1].url}
                            className="h-full"
                            target="_blank"
                        >
                            <Image
                                src={ad.images[1].image}
                                alt={ad.images[1].alt || 'Advertisement 2'}
                                width={1000}
                                height={600}
                                className="object-cover w-full h-full"
                                priority={position === 'home_top'}
                                loading={
                                    position === 'home_top' ? 'eager' : 'lazy'
                                }
                                quality={75}
                            />
                        </Link>
                    </div>
                    <Link
                        href={ad.images[2].url}
                        className={layout[1]}
                        target="_blank"
                    >
                        <Image
                            src={ad.images[2].image}
                            alt={ad.images[2].alt || 'Advertisement 3'}
                            width={1000}
                            height={600}
                            className="object-cover w-full h-full"
                            priority={position === 'home_top'}
                            loading={position === 'home_top' ? 'eager' : 'lazy'}
                            quality={75}
                        />
                    </Link>
                    <Link
                        href={ad.images[3].url}
                        className={layout[2]}
                        target="_blank"
                    >
                        <Image
                            src={ad.images[3].image}
                            alt={ad.images[3].alt || 'Advertisement 4'}
                            width={1000}
                            height={600}
                            className="object-cover w-full h-full"
                            priority={position === 'home_top'}
                            loading={position === 'home_top' ? 'eager' : 'lazy'}
                            quality={75}
                        />
                    </Link>
                </>
            );
        }
    }

    return ad.images.map((imageData, index) => (
        <Link
            key={index}
            href={imageData.url}
            className={`${layout[index]} relative overflow-hidden bg-gray-100`}
            target="_blank"
        >
            <Image
                src={imageData.image}
                alt={imageData.alt || `Advertisement ${index + 1}`}
                width={1000}
                height={600}
                className="object-cover w-full h-full"
                priority={position === 'home_top'}
                loading={position === 'home_top' ? 'eager' : 'lazy'}
                quality={75}
            />
        </Link>
    ));
};

export {
    // layoutPatterns,
    renderBlock1Image,
    renderBlock2Images,
    renderBlock3Images,
    renderBlock4Images
};
