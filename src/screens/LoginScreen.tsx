import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { APP_INFO } from '../constants/app.constants';
import { RootStackParamList } from '../navigation/types';
import { login } from '../services/authService';
import useUserStore from '../stores/userStore';

type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Login'
>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

interface FormData {
    phoneNumber: string;
    passWord: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const { setUser } = useUserStore();

    const [formData, setFormData] = useState<FormData>({
        phoneNumber: '',
        passWord: '',
    });

    const handleSubmit = async () => {
        console.log('Form submitted:', formData);
        try {
            const { accessToken, refreshToken, ...user } = await login(
                formData,
            );

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            setUser(user);

            Alert.alert('Thành công', 'Đăng nhập thành công!');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Lỗi', (error as Error).message);
        }
    };

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <Text style={styles.appName}>{APP_INFO.NAME}</Text>
                    <Text style={styles.subtitle}>
                        Đăng nhập tài khoản {APP_INFO.NAME}
                    </Text>
                    <Text style={styles.subtitle}>
                        để kết nối với ứng dụng {APP_INFO.NAME} Web
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Đăng nhập với mật khẩu</Text>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder='Số điện thoại'
                                value={formData.phoneNumber}
                                onChangeText={(text) =>
                                    handleChange('phoneNumber', text)
                                }
                                keyboardType='phone-pad'
                                autoComplete='tel'
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder='Mật khẩu'
                                value={formData.passWord}
                                onChangeText={(text) =>
                                    handleChange('passWord', text)
                                }
                                secureTextEntry
                                autoComplete='password'
                            />
                        </View>
                    </View>

                    <View style={styles.optionsContainer}>
                        <View style={styles.rememberMeContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => {}}
                            >
                                <View style={styles.checkboxInner} />
                            </TouchableOpacity>
                            <Text style={styles.rememberMeText}>
                                Ghi nhớ đăng nhập
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('ForgotPassword')
                            }
                        >
                            <Text style={styles.forgotPassword}>
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Chưa có tài khoản?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.registerLink}>
                                Đăng ký ngay
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f3ff',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0068ff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    formContainer: {
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
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        gap: 15,
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    input: {
        height: 50,
        fontSize: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: '#0068ff',
        borderRadius: 2,
    },
    rememberMeText: {
        fontSize: 14,
        color: '#333',
    },
    forgotPassword: {
        fontSize: 14,
        color: '#0068ff',
    },
    loginButton: {
        backgroundColor: '#0068ff',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 14,
        color: '#666',
    },
    registerLink: {
        fontSize: 14,
        color: '#0068ff',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
