import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { styled } from 'nativewind';
import React from 'react';
import { Text, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
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

const ProfileScreen = () => (
    <StyledView className='flex-1 items-center justify-center bg-gray-100'>
        <StyledText className='text-xl font-semibold'>Cá Nhân</StyledText>
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
                    tabBarIcon: ({ color }: { color: string }) => (
                        <StyledView
                            style={{
                                height: 24,
                                width: 24,
                                backgroundColor: color,
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name='Contacts'
                component={ContactsScreen}
                options={{
                    tabBarLabel: 'Danh Bạ',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <StyledView
                            style={{
                                height: 24,
                                width: 24,
                                backgroundColor: color,
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name='Discover'
                component={DiscoverScreen}
                options={{
                    tabBarLabel: 'Khám Phá',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <StyledView
                            style={{
                                height: 24,
                                width: 24,
                                backgroundColor: color,
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Cá Nhân',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <StyledView
                            style={{
                                height: 24,
                                width: 24,
                                backgroundColor: color,
                            }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
