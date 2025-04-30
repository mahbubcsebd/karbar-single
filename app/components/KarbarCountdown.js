import Countdown from 'react-countdown';

const KarbarCountdown = ({ endingDate }) => {
    // Random component for completion
    const Completionist = () => <span>Campaign ended!</span>;

    // Renderer callback with condition
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        const formatNumber = (num) => String(num).padStart(2, '0');

        if (completed) {
            return <Completionist />;
        } else {
            return (
                <div className="flex items-center gap-1">
                    <div className="w-12 h-12 text-xs flex flex-col justify-center items-center rounded-[4px] bg-gray-900 text-white">
                        {formatNumber(days)}{' '}
                        <span className="text-[9px]">
                            {days > 1 ? 'days' : 'day'}
                        </span>
                    </div>
                    :{' '}
                    <div className="w-12 h-12 text-xs flex flex-col justify-center items-center rounded-[4px] bg-gray-900 text-white">
                        {formatNumber(hours)}{' '}
                        <span className="text-[9px]">
                            {hours > 1 ? 'hours' : 'hour'}
                        </span>
                    </div>{' '}
                    :{' '}
                    <div className="w-12 h-12 text-xs flex flex-col justify-center items-center rounded-[4px] bg-gray-900 text-white">
                        {formatNumber(minutes)}{' '}
                        <span className="text-[9px]">min</span>
                    </div>{' '}
                    :{' '}
                    <div className="w-12 h-12 text-xs flex flex-col justify-center items-center rounded-[4px] bg-gray-900 text-white">
                        {formatNumber(seconds)}{' '}
                        <span className="text-[9px]">sec</span>
                    </div>
                </div>
            );
        }
    };

    // Convert endingDate string to a Date object with GMT+6 adjustment
    const targetDate = new Date(`${endingDate}T00:00:00+06:00`);

    return (
        <div>
            <Countdown
                date={targetDate}
                renderer={renderer}
            />
        </div>
    );
};

export default KarbarCountdown;
