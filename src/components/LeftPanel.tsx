import { styled } from 'nativewind';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export default function LeftPanel() {
    return (
        <StyledScrollView className='flex-1 bg-white'>
            <StyledView className='p-4'>
                <StyledText className='text-lg font-semibold'>
                    Danh sách chat
                </StyledText>
                {/* Thêm danh sách chat ở đây */}
            </StyledView>
        </StyledScrollView>
    );
}
