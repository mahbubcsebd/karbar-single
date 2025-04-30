import LinkButton from './LinkButton';

const LandingSizes = ({
    section_four_available_size,
    button_text,
    button_color,
}) => {
    return (
        <div className="bg-white rounded-lg lg:rounded-[20px] p-[24px] lg:p-10 mt-[30px]">
            <div
                className="grid gap-[18px]"
                dangerouslySetInnerHTML={{
                    __html: section_four_available_size,
                }}
            ></div>
            {/* <h4 className="text-[30px] text-gray-900 font-semibold mb-[18px]">
                Available Sizes:
            </h4>
            <p className="text-2xl font-medium text-gray-600 mb-[30px]">
                Don’t miss out on this limited-time offer. Select your size
                below and get your new favorite pair of trousers now.
            </p>
            <p className="text-2xl font-medium text-gray-600 mb-[30px]">
                Don’t miss out on this limited-time offer. Select your size
                below and get your new favorite pair of trousers now.
            </p> */}
            <div className="pt-[30px] flex justify-start">
                <LinkButton
                    button_text={button_text}
                    button_color={button_color}
                />
            </div>
        </div>
    );
};

export default LandingSizes