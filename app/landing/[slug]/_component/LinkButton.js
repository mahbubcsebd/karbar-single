import Link from 'next/link';

const LinkButton = ({ button_color = '#4C20CD', button_text }) => {
    // Convert hex color to RGB for style computation
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    };

    const rgbColor = hexToRgb(button_color);
    const buttonStyle = rgbColor
        ? {
              '--button-color': button_color,
              '--button-rgb': `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`,
          }
        : {};

    return (
        <Link
            href="#our-package-section"
            style={buttonStyle}
            className={`
                            text-base lg:text-lg
                            text-white
                            font-normal
                            flex items-center
                            justify-center
                            gap-[6px]
                            border
                            rounded-[8px]
                            px-6 lg:px-8
                            py-4 lg:py-5
                            capitalize
                            transition-all
                            duration-150
                            bg-[var(--button-color)]
                            border-[var(--button-color)]
                            hover:bg-transparent
                            hover:text-[var(--button-color)]
                        `}
        >
            {button_text || 'Shop Now'}
        </Link>
    );
};

export default LinkButton;
