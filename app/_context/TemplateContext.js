'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import getTemplate from '../_utils/getTemplate';

export const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            setLoading(true);
            setError(null);

            try {
                const templateData = await getTemplate();
                setTemplate(templateData?.template_name || 'Template01');
            } catch (err) {
                setError(
                    err.message || 'An error occurred while fetching settings'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, []);

    return (
        <TemplateContext.Provider value={{ template, loading, error }}>
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplate = () => useContext(TemplateContext);
