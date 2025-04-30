"use client"

import { useState } from 'react';
import { toast } from 'react-toastify';
import { reviewPost } from '../utils/reviewPost';
import Dropbox from './Dropbox';
import Input from './form/Input';
import ProductRating from './form/ProductRating';
import KarbarButton from './KarbarButton';

const ReviewForm = ({ id, setShowReview, dictionary }) => {
    const [rating, setRating] = useState(0);
    const [successMessage, setSuccessMessage] = useState([]);
    const [images, setImages] = useState([]);
    const [commentMsg, setCommentMsg] = useState(null);
    const [nameMsg, setNameMsg] = useState(null);
    const [emailMsg, setEmailMsg] = useState(null);
    const [files, setFiles] = useState([]);
    const [reviewImages, setReviewImages] = useState([]);
    const [imageFormData, setImageFormData] = useState(null);
    const {
        yourRating,
        reviewComment,
        reviewUpload,
        reviewName,
        reviewEmail,
        reviewSubmit,
    } = dictionary.Form;


    const handleRatingChange = (value) => {
        setRating(value);
    };

    const [formData, setFormData] = useState({
        review: '',
        name: '',
        email: '',
    });

    const submitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const { name, email, review } = data;

        if (name === '' || name === null || name === undefined) {
            setNameMsg('Name is required');
        } else {
            setNameMsg(null);
        }

        if (email === '' || email === null || email === undefined) {
            setEmailMsg('Email is required');
        } else {
            setEmailMsg(null);
        }

        if (review === '' || review === null || review === undefined) {
            setCommentMsg('Comment is required');
        } else {
            setCommentMsg(null);
        }

        const reviewData = {
            ...data,
            rating,
            product_id: id,
            images: reviewImages,
        };

        try {
            const response = await reviewPost(JSON.stringify(reviewData));

            // Check for successful response
            if (response.ok) {
                const responseData = await response.json();

                if (responseData.success) {
                    setShowReview(false);
                    toast.success(`${responseData.success}`, {
                        position: 'bottom-right',
                    });
                }
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div className="pb-20 review-form-section">
            <form
                id="review-form"
                onSubmit={submitHandler}
            >
                <div className="grid gap-6">
                    <div className="review-rating-box bg-white border border-[#D0D5DD] rounded-lg">
                        <div className="grid justify-center text-center p-[27px]">
                            <p className="mb-3 text-sm font-semibold text-gray-700 capitalize">
                                {yourRating} :
                            </p>
                            <ProductRating
                                handleRatingChange={handleRatingChange}
                                rating={rating}
                                value={formData.rating}
                                onChange={handleRatingChange}
                            />
                        </div>
                    </div>
                    <div className="">
                        <label
                            htmlFor="review-comment"
                            className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize"
                        >
                            {reviewComment}
                        </label>
                        <textarea
                            name="review"
                            id="review-comment"
                            rows="5"
                            required
                            className="block w-full px-6 py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow capitalize"
                        />
                        {commentMsg && (
                            <small className="mt-1 text-red-500">
                                {commentMsg}
                            </small>
                        )}
                    </div>

                    {/* Photo Upload */}
                    <div className="flex flex-col gap-[6px] md:gap-4 md:items-center md:flex-row">
                        <div>
                            <label
                                htmlFor="review-image"
                                className="block text-gray-700 text-sm font-semibold mb-[6px] min-w-[170px] capitalize"
                            >
                                {reviewUpload} :
                            </label>
                        </div>
                        <Dropbox
                            setFiles={setFiles}
                            files={files}
                            reviewImages={reviewImages}
                            setReviewImages={setReviewImages}
                            setImageFormData={setImageFormData}
                            dictionary={dictionary}
                        />
                    </div>
                    <div className="grid gap-6 mb-6">
                        <Input
                            label={reviewName}
                            type="text"
                            name="name"
                            message={nameMsg ? nameMsg : null}
                            value={formData.name}
                        />
                        <Input
                            label="আপনার ইমেইল / ফোন নম্বর দিন"
                            type="text"
                            name="email"
                            message={emailMsg ? emailMsg : null}
                            value={formData.email}
                        />
                    </div>
                </div>
                <KarbarButton
                    type="submit"
                    className="flex justify-center items-center gap-[6px] text-base font-medium px-6 py-4 rounded-md w-full text-center sm:w-auto">
                    {reviewSubmit}
                </KarbarButton>
                {/* <button
                    type="submit"
                    className="flex justify-center items-center gap-[6px] text-base text-white font-medium px-6 py-4 bg-black rounded-md w-full text-center sm:w-auto"
                >
                    {reviewSubmit}
                </button> */}
            </form>
        </div>
    );
};

export default ReviewForm;
