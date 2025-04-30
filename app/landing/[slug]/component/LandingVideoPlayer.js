
const LandingVideoPlayer = ({ videoUrl }) => {
    return (
        <div>
            <div
                className="min-w-[300px] h-[200px] sm:min-w-[550px] sm:h-[309px] md:min-w-[650px] md:h-[365px] xl:min-w-[970px] xl:h-[550px] iframe-wrapper"
                dangerouslySetInnerHTML={{
                    __html: videoUrl,
                }}
            ></div>
        </div>
    );
};

export default LandingVideoPlayer