import PropTypes from 'prop-types';
import { ChangeEvent, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface InputProps {
    label?: string;
    type?:
        | 'text'
        | 'password'
        | 'email'
        | 'number'
        | 'tel'
        | 'url'
        | 'search'
        | 'date'
        | 'time'
        | 'datetime-local';
    name: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ComponentType<{ className?: string }>;
    autoComplete?: string;
}

const Input = ({
    label,
    type = 'text',
    name,
    value = '',
    onChange = () => {},
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    icon: Icon,
    autoComplete,
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' && !showPassword ? 'password' : type;

    // Xác định giá trị autoComplete mặc định dựa vào type
    const getAutoComplete = () => {
        if (autoComplete) return autoComplete;
        switch (type) {
            case 'password':
                return 'current-password';
            case 'email':
                return 'email';
            case 'tel':
                return 'tel';
            default:
                return 'off';
        }
    };

    return (
        <div className='w-full'>
            {label && (
                <label
                    htmlFor={name}
                    className='block text-sm font-medium text-gray-700 mb-1'
                >
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}

            <div className='relative'>
                {Icon && (
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Icon className='h-5 w-5 text-gray-400' />
                    </div>
                )}

                <input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete={getAutoComplete()}
                    className={`
            w-full rounded-md pr-10 shadow-sm
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2
            border border-gray-300
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${
                error
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : ''
            }
            ${className}
          `}
                />

                {type === 'password' && (
                    <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    >
                        {showPassword ? (
                            <FaEyeSlash className='h-5 w-5 text-gray-400' />
                        ) : (
                            <FaEye className='h-5 w-5 text-gray-400' />
                        )}
                    </button>
                )}
            </div>

            {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf([
        'text',
        'password',
        'email',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
    ]),
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.elementType,
    autoComplete: PropTypes.string,
};

export default Input;
