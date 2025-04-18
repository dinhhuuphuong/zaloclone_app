import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import AddFriendScreen from '../screens/AddFriendScreen';
import AddFriendsScreen from '../screens/AddFriendsScreen';
import ChatScreen from '../screens/ChatScreen';
import ForgotPassword from '../screens/ForgotPassword';
import FriendRequestsScreen from '../screens/FriendRequestsScreen';
import LoginScreen from '../screens/LoginScreen';
import OtherUserProfile from '../screens/OtherUserProfile';
import RegisterScreen from '../screens/RegisterScreen';
import ShareMessage from '../screens/ShareMessageScreen';
import UpdatePassword from '../screens/UpdatePassword';
import { getCurrentUser } from '../services/authService';
import useUserStore from '../stores/userStore';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
    const { setUser } = useUserStore();

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập từ AsyncStorage
        const checkLoginStatus = async () => {
            try {
                const userToken = await AsyncStorage.getItem('accessToken');

                if (!userToken) {
                    setIsLoggedIn(false);
                    return;
                }

                const user = await getCurrentUser();

                if (user) setUser(user);
                setIsLoggedIn(!!userToken);
            } catch (error) {
                console.error('Lỗi khi kiểm tra đăng nhập:', error);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    // Hiển thị màn hình loading khi đang kiểm tra trạng thái đăng nhập
    if (isLoggedIn === null) {
        return null; // Hoặc màn hình loading
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#fff' },
                }}
                initialRouteName={isLoggedIn ? 'Home' : 'Login'}
            >
                <Stack.Screen name='Home' component={MainTabNavigator} />
                <Stack.Screen name='Login' component={LoginScreen} />
                <Stack.Screen name='Register' component={RegisterScreen} />
                <Stack.Screen
                    name='ForgotPassword'
                    component={ForgotPassword}
                />
                <Stack.Screen
                    name='UpdatePassword'
                    component={UpdatePassword}
                />
                <Stack.Screen name='Chat' component={ChatScreen} />
                <Stack.Screen name='AddFriends' component={AddFriendsScreen} />
                <Stack.Screen name='AddFriend' component={AddFriendScreen} />
                <Stack.Screen
                    name='OtherUserProfile'
                    component={OtherUserProfile}
                />
                <Stack.Screen
                    name='FriendRequests'
                    component={FriendRequestsScreen}
                />
                <Stack.Screen name='ShareMessage' component={ShareMessage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
