import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { styled } from 'nativewind';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { logout } from '../services/authService';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleLogout = async () => {
        await logout();
        navigation.navigate('Login');
    };

    return (
        <StyledView className='flex-1 items-center justify-center p-4 bg-gray-100'>
            <StyledText className='text-2xl font-bold mb-6 text-gray-800'>
                Trang Chính
            </StyledText>
            <StyledButton
                onPress={handleLogout}
                className='bg-red-500 px-6 py-3 rounded-lg'
            >
                <StyledText className='text-white font-semibold'>
                    Đăng xuất
                </StyledText>
            </StyledButton>
        </StyledView>
    );
}
