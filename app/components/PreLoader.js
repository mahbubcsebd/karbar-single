"use client"

// import Lottie from 'lottie-react';
// import daribLoader from '../assets/lottie/daarib-loader.json';

const PreLoader = () => {
  return (
      <div className="pre-loader">
          <div className="pre-loader-area">
              <div className="container">
                  <div className="relative flex items-center justify-center h-screen z-999999999999999999999999">
                      {/* <Lottie
                          animationData={daribLoader}
                          loop={true}
                          autoplay={true}
                      /> */}
                      <div className="loader"></div>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default PreLoader