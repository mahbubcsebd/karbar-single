import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = () => {
    return (
        <div className="overflow-hidden rounded-lg product-card">
            <div className="product-content p-[10px] md:p-[18px] bg-white ">
                <div className="block product-image h-[240px] sm:h-[373px] md:h-[240px] lg:h-[250px] xl:h-[250px] 1xl:h-[300px] 2xl:h-[300px] rounded-tl-lg rounded-tr-lg overflow-hidden relative mb-[18px]">
                    <Skeleton className="object-cover w-full h-full rounded-tl-lg rounded-tr-lg" />
                </div>
                <div className="mb-1 w-6/8">
                    <Skeleton className="h-[28px] w-full" />
                </div>
                <div className="mb-[18px] w-3/4">
                    <Skeleton className="h-[28px] w-full" />
                </div>
                <div>
                    <Skeleton className="h-[48px] rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
