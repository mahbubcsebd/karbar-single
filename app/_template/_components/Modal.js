/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useContext, useEffect, useRef } from 'react';
import { ModalContext } from '../../_context/ModalContext';

const Modal = ({videoUrl}) => {
    const {isOpen, setIsOpen} = useContext(ModalContext);
    const modalRef = useRef();

        const openModal = () => {
            setIsOpen(true);
        };

        const closeModal = () => {
            setIsOpen(false);
        };

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, handleClickOutside]);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center transition-opacity duration-300 bg-black z-9999999999 bg-opacity-70">
                    <div
                        ref={modalRef}
                        className="p-2 transition-transform duration-300 transform scale-100 bg-white rounded-lg shadow-lg md:p-4"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-0 flex items-center justify-center w-5 h-5 text-lg text-gray-700 bg-white rounded-full shadow-xs md:text-2xl md:w-7 md:h-7 -right-6 md:-right-8 hover:text-gray-900 focus:outline-hidden"
                        >
                            &times;
                        </button>
                        <div
                            className="min-w-[300px] h-[168px] sm:min-w-[550px] sm:h-[309px] md:min-w-[650px] md:h-[365px] xl:min-w-[700px] xl:h-[393px] iframe-wrapper"
                            dangerouslySetInnerHTML={{
                                __html: videoUrl,
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
