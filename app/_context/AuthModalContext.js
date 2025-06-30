'use client';

import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authType, setAuthType] = useState('signIn');

  const openModal = (type = 'signIn') => {
    setAuthType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === 'signIn' ? 'signUp' : 'signIn'));
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        authType,
        toggleAuthType,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  return useContext(AuthModalContext);
};
