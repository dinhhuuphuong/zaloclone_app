import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { styled } from 'nativewind';
import React from 'react';
import { Text, View } from 'react-native';
import { ChatIcon, MeIcon } from '../assets/svg';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { RootStackParamList } from './types';

const StyledView = styled(View);
const StyledText = styled(Text);

// Placeholders cho các màn hình chưa được tạo
const ContactsScreen = () => (
    <StyledView className='flex-1 items-center justify-center bg-gray-100'>
        <StyledText className='text-xl font-semibold'>Danh Bạ</StyledText>
    </StyledView>
);

const DiscoverScreen = () => (
    <StyledView className='flex-1 items-center justify-center bg-gray-100'>
        <StyledText className='text-xl font-semibold'>Khám Phá</StyledText>
    </StyledView>
);

const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#1a73e8',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    paddingVertical: 5,
                    height: 60,
                },
            }}
        >
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Tin Nhắn',
                    tabBarIcon: ChatIcon,
                }}
            />
            <Tab.Screen
                name='Contacts'
                component={ContactsScreen}
                options={{
                    tabBarLabel: 'Danh Bạ',
                    tabBarIcon: ChatIcon,
                }}
            />
            <Tab.Screen
                name='Discover'
                component={DiscoverScreen}
                options={{
                    tabBarLabel: 'Khám Phá',
                    tabBarIcon: ChatIcon,
                }}
            />
            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Cá Nhân',
                    tabBarIcon: MeIcon,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
