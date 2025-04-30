import { useContext } from 'react';
import { TemplateContext } from '../context/TemplateContext';

const useTemplate = () => {
    const { template, loading, error } = useContext(TemplateContext);
    return { template, loading, error };
};

export default useTemplate;
