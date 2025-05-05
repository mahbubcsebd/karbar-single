import React from 'react';

const SectionTitle = ({ title, position }) => {
    return (
        <div
            className={`flex md:mb-[60px] mb-6 ${
                position === 'start' ? '' : 'justify-center'
            }`}
        >
            <h2 className="text-2xl font-semibold text-gray-800 capitalize md:text-4xl">
                {title}
            </h2>
        </div>
    );
};

export default SectionTitle