'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

const ImageMagnifier = ({ src, width, height, zoomLevel = 2 }) => {
    const [isMagnifying, setIsMagnifying] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
    const imageRef = useRef();

    const handleMove = (x, y) => {
        const { left, top, width, height } =
            imageRef.current.getBoundingClientRect();
        const xPercent = ((x - left) / width) * 100;
        const yPercent = ((y - top) / height) * 100;
        setBackgroundPosition(`${xPercent}% ${yPercent}%`);
    };

    const handleMouseMove = (e) => {
        handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        }
    };

    const handleStart = () => setIsMagnifying(true);

    const handleEnd = () => setIsMagnifying(false);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: isMagnifying ? 'zoom-out' : 'zoom-in',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleStart}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEnd}
            ref={imageRef}
        >
            <Image
                src={src}
                alt="Zoomable"
                width={width}
                height={height}
                onError={() => console.error('Image failed to load')}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    transition: 'opacity 0.3s ease',
                    opacity: 1,
                }}
                className="object-cover w-full h-full"
            />
            {isMagnifying && (
                <div
                    style={{
                        backgroundImage: `url("${src}")`,
                        backgroundPosition: backgroundPosition,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${zoomLevel * 100}% ${
                            zoomLevel * 100
                        }%`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 99999,
                    }}
                ></div>
            )}
        </div>
    );
};

export default ImageMagnifier;
