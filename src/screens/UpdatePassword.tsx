import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_INFO } from '../constants/app.constants';
import { updatePassword } from '../services/apiFunctionsUser';

interface Errors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Errors>({});

    const handleFinalSubmit = async () => {
        // Xử lý logic cập nhật mật khẩu ở đây
        console.log('Updating password...');
        try {
            await updatePassword({
                currentPassWord: currentPassword,
                newPassWord: newPassword,
                reNewPassWord: confirmPassword,
            });

            Alert.alert('Thành công', 'Mật khẩu đã được cập nhật thành công');
        } catch (error: any) {
            Alert.alert(
                'Lỗi',
                error.data?.message || error.message || 'Mật khẩu không chính xác',
            );
        }
    };

    const validatePassword = (passWord: string): string => {
        return passWord.length >= 6 ? '' : 'Mật khẩu phải có ít nhất 6 ký tự';
    };

    const validateConfirmPassword = (confirmPassword: string): string => {
        return confirmPassword === newPassword ? '' : 'Mật khẩu không khớp';
    };

    const handleChange = (name: keyof Errors, value: string) => {
        switch (name) {
            case 'currentPassword':
                setCurrentPassword(value);
                setErrors((prev) => ({
                    ...prev,
                    currentPassword: validatePassword(value),
                }));
                break;
            case 'newPassword':
                setNewPassword(value);
                setErrors((prev) => ({
                    ...prev,
                    newPassword: validatePassword(value),
                }));
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(value),
                }));
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.appName}>{APP_INFO.NAME}</Text>
                        <Text style={styles.subtitle}>
                            Cập nhật mật khẩu tài khoản {APP_INFO.NAME}
                        </Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.title}>Cập nhật mật khẩu</Text>
                        <View style={styles.formContainer}>
                            <TextInput
                                placeholder='Mật khẩu hiện tại'
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={(value) =>
                                    handleChange('currentPassword', value)
                                }
                                secureTextEntry
                            />
                            {errors.currentPassword && (
                                <Text style={styles.errorText}>
                                    {errors.currentPassword}
                                </Text>
                            )}

                            <TextInput
                                placeholder='Mật khẩu mới'
                                style={styles.input}
                                value={newPassword}
                                onChangeText={(value) =>
                                    handleChange('newPassword', value)
                                }
                                secureTextEntry
                            />
                            {errors.newPassword && (
                                <Text style={styles.errorText}>
                                    {errors.newPassword}
                                </Text>
                            )}

                            <TextInput
                                placeholder='Xác nhận mật khẩu'
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={(value) =>
                                    handleChange('confirmPassword', value)
                                }
                                secureTextEntry
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword}
                                </Text>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    (!!errors.confirmPassword ||
                                        !!errors.newPassword ||
                                        !!errors.currentPassword) &&
                                        styles.disabledButton,
                                ]}
                                onPress={handleFinalSubmit}
                                disabled={
                                    !!errors.currentPassword ||
                                    !!errors.newPassword ||
                                    !!errors.confirmPassword
                                }
                            >
                                <Text style={styles.buttonText}>Hoàn tất</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f3ff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        color: '#0068ff',
        fontWeight: 'bold',
        fontSize: 32,
    },
    subtitle: {
        textAlign: 'center',
        marginTop: 5,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#0078E8',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UpdatePassword;
