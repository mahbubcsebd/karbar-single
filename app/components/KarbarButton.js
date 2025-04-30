import useSiteSetting from '@/hooks/useSiteSetting';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const KarbarButton = ({
    children,
    className,
    variant = 'default',
    asLink,
    href,
    title,
    onClick,
    disabled,
    preserveHover = false,
    ...props
}) => {
    const { siteSetting } = useSiteSetting();

    const colors = {
        buttonBackgroundColor: siteSetting?.btn_bg_color || '#3490dc',
        buttonTextColor: siteSetting?.btn_text_color || '#ffffff',
        buttonHoverBackgroundColor:
            siteSetting?.btn_hover_bg_color || '#1d72b8',
    };

    const baseStyles =
        'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const getStylesForVariant = (variant) => {
        if (variant === 'default') {
            return {
                backgroundColor: colors.buttonBackgroundColor,
                color: colors.buttonTextColor,
                border: `1px solid ${colors.buttonBackgroundColor}`,
                '--hover-bg': preserveHover
                    ? colors.buttonBackgroundColor
                    : 'transparent',
                '--hover-color': preserveHover
                    ? colors.buttonTextColor
                    : colors.buttonBackgroundColor,
            };
        }

        if (variant === 'outline') {
            return {
                backgroundColor: 'transparent',
                color: colors.buttonBackgroundColor,
                border: `1px solid ${colors.buttonBackgroundColor}`,
                '--hover-bg': preserveHover
                    ? colors.buttonBackgroundColor
                    : colors.buttonBackgroundColor,
                '--hover-color': preserveHover
                    ? colors.buttonTextColor
                    : colors.buttonTextColor,
            };
        }

        return {};
    };

    const hoverStyles = `
        .custom-button:hover {
            background-color: var(--hover-bg) !important;
            color: var(--hover-color) !important;
            border-color: ${colors.buttonBackgroundColor} !important;
        }
    `;

    const Component = asLink ? Link : 'button';

    // Get text content from children for default title
    const getDefaultTitle = () => {
        if (typeof children === 'string') return children;
        if (Array.isArray(children)) {
            return children
                .map(child =>
                    typeof child === 'string' ? child : ''
                )
                .join(' ')
                .trim();
        }
        return '';
    };

    // Use provided title or generate default from children
    const buttonTitle = title || getDefaultTitle();

    return (
        <>
            <style>{hoverStyles}</style>
            <Component
                href={asLink ? href : undefined}
                title={buttonTitle}
                className={cn(baseStyles, 'custom-button', className)}
                style={getStylesForVariant(variant)}
                onClick={onClick}
                disabled={disabled}
                {...props}
            >
                {children}
            </Component>
        </>
    );
};

export default KarbarButton;
