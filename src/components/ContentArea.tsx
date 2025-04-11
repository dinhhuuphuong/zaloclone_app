import { styled } from 'nativewind';
import React from 'react';
import { Text, View } from 'react-native';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function ContentArea() {
    return (
        <StyledView className='flex-1 bg-white'>
            <StyledView className='p-4'>
                <StyledText className='text-lg font-semibold'>
                    Nội dung chat
                </StyledText>
                {/* Thêm nội dung chat ở đây */}
            </StyledView>
        </StyledView>
    );
}
