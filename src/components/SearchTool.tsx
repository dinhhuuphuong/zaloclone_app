import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import React from 'react';
import { TextInput, View } from 'react-native';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);

export default function SearchTool() {
    return (
        <StyledView className='p-2 bg-white'>
            <StyledView className='flex-row items-center bg-gray-100 rounded-lg px-3 py-2'>
                <Ionicons name='search' size={20} color='gray' />
                <StyledTextInput
                    className='flex-1 ml-2'
                    placeholder='Tìm kiếm...'
                    placeholderTextColor='gray'
                />
            </StyledView>
        </StyledView>
    );
}
