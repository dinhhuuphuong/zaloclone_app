import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import ForgotPassword from '../screens/ForgotPassword';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
