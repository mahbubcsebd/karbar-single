import Image from 'next/image';
import { FaRegUserCircle } from 'react-icons/fa';
import RatingReadOnly from './RatingReadOnly';

const ClientFeedback = ({ reviews }) => {
    if (reviews.length <= 0) {
        return null;
    }
    return (
        <div className="container pt-10">
            <div className="grid gap-[30px]">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="single-review border-b border-gray-400 pb-[30px]"
                    >
                        <div className="flex flex-col justify-between gap-2 mb-5 sm:gap-0 sm:items-center sm:flex-row">
                            <div className="flex items-center justify-between gap-6 sm:justify-start">
                                <p className="text-lg text-gray-600 font-medium flex items-center gap-[6px] capitalize">
                                    <span>
                                        <FaRegUserCircle />
                                    </span>{' '}
                                    {review.name}
                                </p>
                                <div className="pt-1">
                                    <RatingReadOnly rating={review.rating} />
                                </div>
                            </div>
                            <p className="flex items-center gap-2 text-lg font-medium text-gray-500">
                                <span className="inline-block w-[6px] h-[6px] rounded-full bg-gray-500"></span>{' '}
                                {review.created_at}
                            </p>
                        </div>
                        <div className="max-w-[800px]">
                            <p className="text-lg font-medium text-gray-700">
                                {review.review}
                            </p>
                            <div className="grid grid-cols-4 gap-5 pt-6 md:grid-cols-5">
                                {review.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-[100px] md:h-[145px]"
                                    >
                                        <Image
                                            src={img}
                                            alt="review img"
                                            width={100}
                                            height={100}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* <div className="flex justify-end pt-6">
                <Pagination />
            </div> */}
        </div>
    );
};

export default ClientFeedback;
