// utils/facebookPixel.js
export const trackEvent = (eventName, options = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, options);
    }
};
