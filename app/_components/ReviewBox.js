"use client"

import { useState } from 'react';
import ClientFeedback from './ClientFeedback';
import Ratings from './Ratings';
import Review from './Review';

const ReviewBox = ({ id, reviews, ratings, dictionary }) => {
    const [showReview, setShowReview] = useState(false);

    const handleShowReview = () => {
        setShowReview(true);
    };
    return (
        <div>
            <Ratings
                dictionary={dictionary}
                reviewHandler={handleShowReview}
                ratings={ratings}
            />
            <Review
                dictionary={dictionary}
                showReview={showReview}
                setShowReview={setShowReview}
                id={id}
            />
            <ClientFeedback
                reviews={reviews}
                dictionary={dictionary}
            />
        </div>
    );
};

export default ReviewBox