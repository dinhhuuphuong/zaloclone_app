import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { getCurrentUser } from '../services/authService';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập từ AsyncStorage
        const checkLoginStatus = async () => {
            try {
                const userToken = await AsyncStorage.getItem('accessToken');
                const user = await getCurrentUser();
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
                {isLoggedIn ? (
                    // Các màn hình cho người dùng đã đăng nhập
                    <>
                        <Stack.Screen
                            name='Home'
                            component={MainTabNavigator}
                        />
                        {/* Các màn hình khác yêu cầu đăng nhập */}
                    </>
                ) : (
                    // Các màn hình xác thực
                    <>
                        <Stack.Screen name='Login' component={LoginScreen} />
                        <Stack.Screen
                            name='Register'
                            component={RegisterScreen}
                        />
                        <Stack.Screen name='Home' component={HomeScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
