import { useContext } from 'react';
import { SiteSettingContext } from '../_context/SiteSettingContext';

const useSiteSetting = () => {
    const { siteSetting, loading, error } = useContext(SiteSettingContext);
    return { siteSetting, loading, error };
};

export default useSiteSetting;
