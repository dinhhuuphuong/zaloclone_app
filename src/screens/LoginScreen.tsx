import { StackNavigationProp } from '@react-navigation/stack';
import { styled } from 'nativewind';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Login'
>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    return (
        <StyledView className='flex-1 items-center justify-center p-4 bg-gray-100'>
            <StyledText className='text-2xl font-bold mb-6 text-gray-800'>
                Đăng Nhập
            </StyledText>

            <StyledButton
                className='bg-blue-500 py-3 px-8 rounded-lg mb-4 w-full max-w-xs'
                onPress={() => navigation.navigate('Register')}
            >
                <StyledText className='text-white text-center font-semibold'>
                    Đăng Ký
                </StyledText>
            </StyledButton>

            <StyledButton
                className='bg-green-500 py-3 px-8 rounded-lg w-full max-w-xs'
                onPress={() => navigation.navigate('Home')}
            >
                <StyledText className='text-white text-center font-semibold'>
                    Quay Lại Trang Chính
                </StyledText>
            </StyledButton>
        </StyledView>
    );
}
