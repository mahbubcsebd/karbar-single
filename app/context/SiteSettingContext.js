"use client"

import useDictionary from '@/hooks/useDictionary';
import { createContext, useEffect, useState } from 'react';
import { getSiteSettings } from '../utils/getSiteSettings';

export const SiteSettingContext = createContext();

export const SiteSettingProvider = ({ children }) => {
    const [siteSetting, setSiteSetting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useDictionary();

    useEffect(() => {
        const fetchSiteSettings = async () => {
            setLoading(true);
            setError(null);

            try {
                const settings = await getSiteSettings(language);
                setSiteSetting(settings.data);
            } catch (err) {
                setError(
                    err.message || 'An error occurred while fetching settings'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSiteSettings();
    }, [language]);

    return (
        <SiteSettingContext.Provider value={{ siteSetting, loading, error }}>
            {children}
        </SiteSettingContext.Provider>
    );
};
