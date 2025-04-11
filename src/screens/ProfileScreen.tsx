import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { updateAvatar } from '../services/apiFunctionsUser';
import useUserStore from '../stores/userStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const ProfileScreen = () => {
    const { user, setUser } = useUserStore();
    const navigation = useNavigation<NavigationProp>();
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleUpdatePassword = () => {
        navigation.navigate('UpdatePassword');
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                await handleUpdateAvatar(result);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
        }
    };

    const handleUpdateAvatar = async (result: any) => {
        try {
            const asset = result.assets[0];
            setAvatarPreview(asset.uri);

            const response = await fetch(asset.uri);
            const blob = await response.blob();

            const file = {
                uri: asset.uri,
                name: 'avatar.jpg',
                type: blob.type || 'image/jpeg',
            };

            setIsLoading(true);
            const formData = new FormData();
            formData.append('avatar', file as any);

            const success = await updateAvatar(formData);
            if (success) {
                // Cập nhật avatar mới trong store
                if (user) {
                    setUser({
                        ...user,
                        avatar: asset.uri,
                    });
                }
                Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công');
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            Alert.alert(
                'Lỗi',
                'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage} disabled={isLoading}>
                    <Image
                        source={{
                            uri:
                                avatarPreview ||
                                user?.avatar ||
                                'https://via.placeholder.com/150',
                        }}
                        style={styles.avatar}
                    />
                    <View style={styles.editAvatarButton}>
                        <Text style={styles.editAvatarText}>Thay đổi ảnh</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.fullName}>{user?.fullName}</Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <Text style={styles.value}>{user?.phoneNumber}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.label}>Ngày sinh</Text>
                    <Text style={styles.value}>{user?.dayOfBirth}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.label}>Giới tính</Text>
                    <Text style={styles.value}>
                        {user?.gender ? 'Nam' : 'Nữ'}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleUpdatePassword}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 8,
    },
    editAvatarButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 20,
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    editAvatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    fullName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    infoContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoItem: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;
