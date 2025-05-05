"use client"

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoPlayer = ({ videoUrl }) => {
    const [isClient, setIsClient] = useState(false);

      useEffect(() => {
          // Ensure this code runs only on the client
          setIsClient(true);
      }, []);

        if (!isClient) {
            // Return null or a fallback during SSR
            return null;
        }
    return (
        <div className="w-full h-full video-player-wrapper">
            <ReactPlayer
                url={videoUrl}
                controls={true}
                width="100%"
                height="100%"
            />
        </div>
    );
};

export default VideoPlayer;
