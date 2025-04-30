import { useEffect, useState } from 'react';

const useDynamicComponent = (template, path) => {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (template) {
      console.log('Loading template:', template);

      const importComponent = async () => {
        try {
          const importedModule = await import(
            `../_templates/${template}/${path}`
          );
          setComponent(() => importedModule.default);
        } catch (err) {
          console.error('Failed to load component:', err);
          setError('Component not found');
        }
      };

      importComponent();
    }
  }, [template, path]);

  return { Component, error };
};

export default useDynamicComponent;
