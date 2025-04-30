import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

import quote from '@/assets/icons/quote.svg';
import RatingStars from './RatingStars';

const TestimonialCard = ({ testimonial }) => {
    const { name, rating, review } = testimonial;
    return (
        <div className="single-review-card h-full bg-white rounded-[10px] px-5 py-10 border border-[#E3E3E3] relative">
            <Image
                className="absolute bottom-[14px] right-[30px] z-10"
                src={quote}
                alt="quote"
            />
            <div className="mb-[18px]">
                <div className="flex items-center gap-2">
                    <div>
                        <div className="w-10 h-10 rounded-full">
                            <FaUserCircle size="40" />
                        </div>
                    </div>
                    <div className="w-full">
                        <h2 className="text-base font-medium text-gray-700 capitalize">
                            {name}
                        </h2>
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-normal text-gray-600">
                                Customer
                            </p>
                            <div className="min-w-[140px]">
                                <RatingStars rating={rating} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-base font-medium text-gray-700">{review}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;
