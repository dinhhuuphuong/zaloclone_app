import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddFriendScreen from '../screens/AddFriendScreen';
import AddFriendsScreen from '../screens/AddFriendsScreen';
import ChatScreen from '../screens/ChatScreen';
import ForgotPassword from '../screens/ForgotPassword';
import FriendRequestsScreen from '../screens/FriendRequestsScreen';
import LoginScreen from '../screens/LoginScreen';
import NewGroupScreen from '../screens/NewGroupScreen';
import OptionsScreen from '../screens/OptionsScreen';
import OtherUserProfile from '../screens/OtherUserProfile';
import RegisterScreen from '../screens/RegisterScreen';
import ShareMessage from '../screens/ShareMessageScreen';
import SplashScreen from '../screens/SplashScreen';
import UpdatePassword from '../screens/UpdatePassword';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#fff' },
                }}
                initialRouteName={'SplashScreen'}
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
                <Stack.Screen name='NewGroup' component={NewGroupScreen} />
                <Stack.Screen name='Options' component={OptionsScreen} />
                <Stack.Screen name='SplashScreen' component={SplashScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
