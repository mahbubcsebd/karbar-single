import trackingIcon from "@/assets/icons/track-icon.svg";
import { Check } from 'lucide-react';
import Image from 'next/image';

const OrderTrackingTimeline = ({ orderStatus, orderTracking }) => {
    // Find the current status index from tracking array (latest status)
    const currentStatus = orderTracking[orderTracking.length - 1]?.status || '';
    const currentStatusIndex = orderStatus.findIndex(
        (status) => status === currentStatus
    );

    // Check if "Cancelled" exists in orderTracking
    const showCancelled = orderTracking.some(
        (tracking) => tracking.status === 'Cancelled'
    );

    // Filter the orderStatus to conditionally include "Cancelled"
    const filteredOrderStatus = showCancelled
        ? orderStatus
        : orderStatus.filter((status) => status !== 'Cancelled');

    return (
        <div className="pt-5">
            <h3 className="flex items-center gap-2 pb-2 mb-2 text-lg font-semibold text-gray-900">
                <Image
                    src={trackingIcon}
                    alt="products icon"
                />
                Tracking Timeline
            </h3>

            <div className="relative">
                {filteredOrderStatus.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isInProgress = index === currentStatusIndex + 1;
                    const trackingEntry = orderTracking.find(
                        (t) => t.status === status
                    );

                    return (
                        <div
                            key={status}
                            className="flex h-20 mb-5 items-star"
                        >
                            <div className="pr-4 text-right text-gray-500 w-28">
                                <p>
                                    {trackingEntry?.date && trackingEntry?.date}
                                </p>
                                <p>
                                    {trackingEntry?.time && trackingEntry?.time}
                                </p>
                                {!trackingEntry?.date &&
                                    !trackingEntry?.time && <p>-- : --</p>}
                            </div>
                            {/* Status indicator and connecting line */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={`w-16 flex items-center justify-center ${
                                        isCompleted
                                            ? 'text-green-500'
                                            : isInProgress
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${
                        isCompleted
                            ? 'bg-green-500'
                            : isInProgress
                            ? 'border-4 border-green-500 bg-white'
                            : 'border-4 border-[#A3A3A3]'
                    }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    isInProgress
                                                        ? 'bg-green-500'
                                                        : 'bg-[#A3A3A3]'
                                                }`}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Connecting line */}
                                {index < filteredOrderStatus.length - 1 && (
                                    <div className="absolute w-[1.5px] h-[60px] top-9">
                                        <div
                                            className={`w-full h-full ${
                                                isCompleted
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* Status content */}
                            <div className="flex-1">
                                <h3
                                    className={`font-medium ${
                                        isCompleted
                                            ? 'text-green-500'
                                            : isInProgress
                                            ? 'text-gray-500'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {status}
                                </h3>
                                {trackingEntry && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {trackingEntry.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTrackingTimeline;
