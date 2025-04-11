import PropTypes from 'prop-types';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    variant?:
        | 'primary'
        | 'secondary'
        | 'outline'
        | 'danger'
        | 'success'
        | 'google'
        | 'facebook';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    icon?: React.ComponentType<{ className?: string }>;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    onClick,
    className = '',
    type = 'button',
    icon: Icon,
}: ButtonProps) => {
    const baseStyles =
        'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary:
            'bg-[#0078E8] text-white hover:bg-[#0066CC] focus:ring-[#0078E8]',
        secondary:
            'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline:
            'border-2 border-[#0078E8] text-[#0078E8] hover:bg-[#0078E8]/10 focus:ring-[#0078E8]',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success:
            'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        google: 'border-2 border-[#eb4536] text-[#eb4536] hover:bg-[#eb4536]/10 focus:ring-[#eb4536]',
        facebook:
            'border-2 border-[#0078E8] text-[#0078E8] hover:bg-[#0078E8]/10 focus:ring-[#0078E8]',
    };

    const sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const width = fullWidth ? 'w-full' : '';
    const disabledStyles = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:shadow-md active:transform active:scale-95';
    const iconStyles = Icon ? 'space-x-2' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${width}
        ${disabledStyles}
        ${iconStyles}
        ${className}
      `}
        >
            {Icon && (
                <Icon
                    className={`${
                        size === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                    } mr-2`}
                />
            )}
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf([
        'primary',
        'secondary',
        'outline',
        'danger',
        'success',
        'google',
        'facebook',
    ]),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    icon: PropTypes.elementType,
};

export default Button;
