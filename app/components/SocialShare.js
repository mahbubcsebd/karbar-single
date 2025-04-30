'use client';

import { useEffect, useState } from 'react';
import {
    FacebookIcon,
    FacebookShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from 'react-share';
import CopyToClipboard from './CopyToClipboard';

const SocialShare = ({dictionary}) => {
    const [shareUrl, setShareUrl] = useState('');
    const [copy, setCopy] = useState(false);

      useEffect(() => {
          if (process) {
              setShareUrl(window.location.href);
          }
      }, []);


    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
                <h3 className="text-xl font-medium text-gray-900">
                    {dictionary.socialShareDic}:
                </h3>
                <div className="flex items-center gap-2">
                    <FacebookShareButton
                        url={shareUrl}
                        aria-label="Share on Facebook"
                    >
                        <FacebookIcon
                            size={24}
                            round
                        />
                    </FacebookShareButton>
                    {/* <TwitterShareButton url={shareUrl}>
                    <XIcon
                        size={24}
                        round
                    />
                </TwitterShareButton> */}
                    {/* <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon
                        size={24}
                        round
                    />
                </LinkedinShareButton> */}
                    {/* <TelegramShareButton url={shareUrl}>
                    <TelegramIcon
                        size={24}
                        round
                    />
                </TelegramShareButton> */}
                    <WhatsappShareButton
                        url={shareUrl}
                        aria-label="Share on WhatsApp"
                    >
                        <WhatsappIcon
                            size={24}
                            round
                        />
                    </WhatsappShareButton>
                </div>
            </div>
            <CopyToClipboard
                pathUrl={shareUrl}
                copy={copy}
                setCopy={setCopy}
            />
        </div>
    );
};

export default SocialShare;
