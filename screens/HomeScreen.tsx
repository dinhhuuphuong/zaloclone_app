import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import Button from '../components/Button';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function HomeScreen() {
    return (
        <StyledView className='flex-1 items-center justify-center p-4 bg-gray-100'>
            <StyledText className='text-2xl font-bold mb-6 text-gray-800'>
                Trang Chính
            </StyledText>

            <Button
                title='Đăng nhập'
                onPress={() => console.log('Đăng nhập được nhấn')}
                variant='primary'
            />

            <StyledView className='h-4' />

            <Button
                title='Đăng ký'
                onPress={() => console.log('Đăng ký được nhấn')}
                variant='secondary'
            />
        </StyledView>
    );
}
