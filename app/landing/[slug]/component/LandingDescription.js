import VideoPlayer from '../../../components/VideoPlayer';
import LandingKeyFetures from './LandingKeyFetures';
import LandingSave from './LandingSave';
import LandingSizes from './LandingSizes';

const LandingDescription = ({ landing, button_text, button_color }) => {
    const {
        section_three_video,
        section_three_key_feature,
        section_three_offer_order,
        section_four_available_size,
    } = landing || {};
    return (
        <div className="mb-[60px]">
            <div className="container grid justify-center">
                <div className="max-w-[970px]">
                    {/* {section_three_video && (
                        <LandingVideoPlayer videoUrl={section_three_video} />
                    )} */}
                    {section_three_video && (
                        <div className="min-w-[300px] h-[200px] sm:min-w-[550px] sm:h-[309px] md:min-w-[650px] md:h-[365px] xl:min-w-[970px] xl:h-[550px] iframe-wrapper">
                            <VideoPlayer videoUrl={section_three_video} />
                        </div>
                    )}
                    {section_three_key_feature && (
                        <LandingKeyFetures
                            section_three_key_feature={
                                section_three_key_feature
                            }
                        />
                    )}
                    {section_three_offer_order && (
                        <LandingSave
                            section_three_offer_order={
                                section_three_offer_order
                            }
                            button_text={button_text}
                            button_color={button_color}
                        />
                    )}
                    {section_four_available_size && (
                        <LandingSizes
                            section_four_available_size={
                                section_four_available_size
                            }
                            button_text={button_text}
                            button_color={button_color}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingDescription;
