import ReviewForm from "./ReviewForm";

const Review = ({ id, showReview, setShowReview, dictionary }) => {
    const { productReview } = dictionary;
    return (
        showReview && (
            <div
                id="product-review"
                className="pt-20 product-review"
            >
                <div className="product-review-area">
                    <div className="container">
                        <div className="flex items-center justify-between mb-[30px] md:mb-16">
                            <h3 className="text-base font-semibold text-gray-800 md:text-2xl">
                                {productReview}
                            </h3>
                            {/* <div className="flex items-center gap-2">
                            <p className="text-base font-normal text-gray-800">
                                ক্রমানুসারে :
                            </p>
                            <div className="">
                                <select className="py-[7px] px-[10px] text-base text-gray-500 border-0 rounded-md focus:outline-hidden focus:ring-0 mr-4">
                                    <option value="new">নতুন</option>
                                    <option value="popular">জনপ্রিয়</option>
                                    <option value="rating">রেটিং</option>
                                </select>
                            </div>
                        </div> */}
                        </div>
                        {showReview && (
                            <div className="max-w-[670px]">
                                <ReviewForm
                                    dictionary={dictionary}
                                    id={id}
                                    setShowReview={setShowReview}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default Review