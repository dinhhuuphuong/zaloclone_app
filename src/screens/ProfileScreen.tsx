import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import useUserStore from '../stores/userStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const ProfileScreen = () => {
    const { user } = useUserStore();
    const navigation = useNavigation<NavigationProp>();

    const handleUpdatePassword = () => {
        navigation.navigate('UpdatePassword');
    };

    return (
        <View>
            <Text>{user?.fullName}</Text>

            <TouchableOpacity onPress={handleUpdatePassword}>
                <Text>Cập nhật mật khẩu</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;
