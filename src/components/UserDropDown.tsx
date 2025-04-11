import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { User } from '../stores/userStore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface UserDropDownProps {
    user: User;
    signOut: () => Promise<void>;
}

export default function UserDropDown({ user, signOut }: UserDropDownProps) {
    return (
        <StyledView className='absolute top-16 right-0 bg-white rounded-lg shadow-lg p-2 w-48'>
            <StyledView className='p-2'>
                <StyledText className='font-semibold'>
                    {user.fullName}
                </StyledText>
            </StyledView>
            <StyledTouchableOpacity
                onPress={signOut}
                className='p-2 flex-row items-center'
            >
                <StyledText className='text-red-500'>Đăng xuất</StyledText>
            </StyledTouchableOpacity>
        </StyledView>
    );
}
