import Image from 'next/image';
import { BiEditAlt } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import borderImg from "../assets/icons/border.svg";
import KarbarButton from './KarbarButton';
import RatingReadOnly from "./RatingReadOnly";

const Ratings = ({ reviewHandler, ratings, dictionary }) => {
    const {
        total_ratings,
        average_rating,
        total_five_stars,
        total_four_stars,
        total_three_stars,
        total_two_stars,
        total_one_stars,
    } = ratings;

    const { ratingAndReview, totalRating, writeReview } = dictionary;

    // Percentage Calculation
    function calculateRatingPercentages(ratings) {
        const totalRatings = ratings.total_ratings;

        if (totalRatings === 0) {
            return {
                fiveStar: 0,
                fourStar: 0,
                threeStar: 0,
                twoStar: 0,
                oneStar: 0,
            };
        }

        const percentages = {
            fiveStar: Math.round((total_five_stars / totalRatings) * 100),
            fourStar: Math.round((total_four_stars / totalRatings) * 100),
            threeStar: Math.round((total_three_stars / totalRatings) * 100),
            twoStar: Math.round((total_two_stars / totalRatings) * 100),
            oneStar: Math.round((total_one_stars / totalRatings) * 100),
        };

        return percentages;
    }

    const ratingPercentages = calculateRatingPercentages(ratings);

    const { fiveStar, fourStar, threeStar, twoStar, oneStar } =
        ratingPercentages;

    return (
        <div
            id="ratings"
            className="pt-20 ratings"
        >
            <div className="ratings-area">
                <div className="container">
                    <div className="flex flex-col justify-between mb-10 md:items-center md:flex-row">
                        <div className="relative">
                            <h3 className="pb-2 text-2xl font-semibold text-gray-800 capitalize md:text-3xl">
                                {ratingAndReview}
                            </h3>
                            <Image
                                className="absolute bottom-0 left-0"
                                src={borderImg}
                                alt="border img"
                            />
                        </div>
                        <KarbarButton
                            asLink
                            href="#product-review"
                            onClick={reviewHandler}
                            variant="outline"
                            className="hidden md:flex justify-center items-center gap-[6px] font-medium px-6 py-4 text-base  rounded-md hover:bg-transparent transition duration-150"
                        >
                            <span className="inline-block text-xl">
                                <BiEditAlt />
                            </span>
                            {writeReview}
                        </KarbarButton>
                        {/* <Link
                            href="#product-review"
                            onClick={reviewHandler}
                            className="hidden md:flex justify-center items-center gap-[6px] text-base text-white font-medium px-6 py-4 bg-gray-900 border border-gray-900 rounded-md hover:bg-transparent hover:text-gray-900 transition duration-150"
                        >
                            <span className="inline-block text-xl">
                                <BiEditAlt />
                            </span>
                            {writeReview}
                        </Link> */}
                    </div>
                    <div className="flex items-center gap-5 md:gap-10 px-3 py-[18px] bg-white rounded-lg md:px-0 md:py-0 md:bg-transparent md:rounded-none">
                        <div>
                            <div className="w-[100px] md:w-auto">
                                <h2 className="text-4xl md:text-[64px] md:leading-snug text-gray-800 font-semibold mb-1">
                                    {average_rating}
                                </h2>
                                <RatingReadOnly rating={average_rating} />
                                <p className="text-xs font-normal text-gray-600 md:text-xl">
                                    {total_ratings} {totalRating}
                                </p>
                            </div>
                        </div>
                        <div className="md:hidden divider w-[1px] h-[100px] bg-gray-400"></div>
                        <div className="w-[392px]">
                            <ul className="grid gap-[6px] md:gap-4">
                                <li className="flex items-center gap-2 md:gap-3 single-rating">
                                    <p className="flex items-center gap-[2px] md:gap-1 text-xs font-medium text-gray-800 md:text-xl">
                                        <span className="pt-[1px] w-3">5</span>
                                        <span className="inline-block text-xs md:text-base text-[#05C168]">
                                            <FaStar />
                                        </span>
                                    </p>
                                    <div className="w-full h-[7px] md:h-[10px] bg-[#D9D9D9] rounded-full">
                                        <div
                                            className="h-[7px] md:h-[10px] bg-[#05C168] rounded-full"
                                            style={{ width: `${fiveStar}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[11px] md:text-lg font-medium text-gray-600">
                                        {total_five_stars}
                                    </p>
                                </li>
                                <li className="flex items-center gap-2 md:gap-3 single-rating">
                                    <p className="flex items-center gap-[2px] md:gap-1 text-xs font-medium text-gray-800 md:text-xl">
                                        <span className="pt-[1px] w-3">4</span>
                                        <span className="text-xs md:text-base text-[#FF9E2C]">
                                            <FaStar />
                                        </span>
                                    </p>
                                    <div className="w-full h-[7px] md:h-[10px] bg-[#D9D9D9] rounded-full">
                                        <div
                                            className="h-[7px] md:h-[10px] bg-[#FF9E2C] rounded-full"
                                            style={{ width: `${fourStar}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[11px] md:text-lg font-medium text-gray-600">
                                        {total_four_stars}
                                    </p>
                                </li>
                                <li className="flex items-center gap-2 md:gap-3 single-rating">
                                    <p className="flex items-center gap-[2px] md:gap-1 text-xs font-medium text-gray-800 md:text-xl">
                                        <span className="pt-[1px] w-3">3</span>
                                        <span className="text-xs md:text-base text-[#FF9E2C]">
                                            <FaStar />
                                        </span>
                                    </p>
                                    <div className="w-full h-[7px] md:h-[10px] bg-[#D9D9D9] rounded-full">
                                        <div
                                            className="h-[7px] md:h-[10px] bg-[#FF9E2C] rounded-full"
                                            style={{ width: `${threeStar}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[11px] md:text-lg font-medium text-gray-600">
                                        {total_three_stars}
                                    </p>
                                </li>
                                <li className="flex items-center gap-2 md:gap-3 single-rating">
                                    <p className="flex items-center gap-[2px] md:gap-1 text-xs font-medium text-gray-800 md:text-xl">
                                        <span className="pt-[1px] w-3">2</span>
                                        <span className="text-xs md:text-base text-[#FF9E2C]">
                                            <FaStar />
                                        </span>
                                    </p>
                                    <div className="w-full h-[7px] md:h-[10px] bg-[#D9D9D9] rounded-full">
                                        <div
                                            className="h-[7px] md:h-[10px] bg-[#FF9E2C] rounded-full"
                                            style={{ width: `${twoStar}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[11px] md:text-lg font-medium text-gray-600">
                                        {total_two_stars}
                                    </p>
                                </li>
                                <li className="flex items-center gap-2 md:gap-3 single-rating">
                                    <p className="flex items-center gap-[2px] md:gap-1 text-xs font-medium text-gray-800 md:text-xl">
                                        <span className="pt-[1px] w-3">1</span>
                                        <span className="text-xs md:text-base text-[#DC2B2B]">
                                            <FaStar />
                                        </span>
                                    </p>
                                    <div className="w-full h-[7px] md:h-[10px] bg-[#D9D9D9] rounded-full">
                                        <div
                                            className="h-[7px] md:h-[10px] bg-[#DC2B2B] rounded-full"
                                            style={{ width: `${oneStar}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[11px] md:text-lg font-medium text-gray-600">
                                        {total_one_stars}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button
                        onClick={reviewHandler}
                        className="mt-5 md:hidden flex justify-center items-center gap-[6px] text-base text-white font-medium px-6 py-4 bg-black rounded-md"
                    >
                        <span className="inline-block text-xl">
                            <BiEditAlt />
                        </span>
                        রিভিউ লিখুন
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ratings