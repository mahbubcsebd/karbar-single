import LinkButton from './LinkButton';

const LandingSave = ({
    section_three_offer_order,
    button_text,
    button_color,
}) => {
    return (
        <div className="grid justify-center mt-10">
            <div className="grid justify-center text-center mx-auto  max-w-[600px]">
                <div
                    className=""
                    dangerouslySetInnerHTML={{
                        __html: section_three_offer_order,
                    }}
                ></div>
                {/* <h4 className="text-[30px] text-gray-900 font-semibold mb-[18px]">
                  Order Today and Save!
              </h4>
              <p className="text-2xl font-medium text-gray-600 mb-[30px]">
                  Don’t miss out on this limited-time offer. Select your size
                  below and get your new favorite pair of trousers now.
              </p> */}
                <div className="pt-[30px] grid justify-center">
                    <LinkButton
                        button_text={button_text}
                        button_color={button_color}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingSave