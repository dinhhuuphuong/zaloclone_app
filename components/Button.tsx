import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
}: ButtonProps) {
    const baseStyle = 'py-3 px-5 rounded-lg';

    const variantStyles = {
        primary: 'bg-blue-500',
        secondary: 'bg-gray-300',
    };

    const textStyles = {
        primary: 'text-white font-bold',
        secondary: 'text-gray-800 font-semibold',
    };

    return (
        <StyledTouchableOpacity
            className={`${baseStyle} ${variantStyles[variant]}`}
            onPress={onPress}
        >
            <StyledText className={`text-center ${textStyles[variant]}`}>
                {title}
            </StyledText>
        </StyledTouchableOpacity>
    );
}
