import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
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
import OTPInput from '../components/OTPInput';
import { APP_INFO } from '../constants/app.constants';
import app, { auth } from '../firebase/firebase';
import { checkPhoneNumber, forgetPassword } from '../services/apiFunctionsUser';

// Define navigation type
type RootStackParamList = {
    Login: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface FormData {
    phoneNumber: string;
    passWord: string;
    otp: string;
    confirm_password: string;
}

interface Errors {
    phoneNumber?: string;
    passWord?: string;
    otp?: string;
    confirm_password?: string;
}

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        phoneNumber: '',
        passWord: '',
        otp: '',
        confirm_password: '',
    });
    const [errors, setErrors] = useState<Errors>({});
    const navigation = useNavigation<NavigationProp>();
    const [verificationId, setVerificationId] = useState<string>('');
    const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

    useEffect(() => {
        console.log('formData OTP', formData);
    }, [formData]);

    const handleSendOTP = async () => {
        try {
            const phoneNumber = '+84' + formData.phoneNumber.slice(1);
            console.log('Số điện thoại:', phoneNumber);

            // Kiểm tra recaptchaVerifier đã được khởi tạo chưa
            if (!recaptchaVerifier.current) {
                Alert.alert(
                    'Lỗi',
                    'Không thể khởi tạo reCAPTCHA. Vui lòng thử lại.',
                );
                return;
            }

            // Sử dụng FirebaseRecaptchaVerifierModal để xác minh người dùng
            const phoneProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current,
            );

            setVerificationId(verificationId);
            Alert.alert('Thành công', 'OTP đã được gửi thành công!');
            setStep(2);
        } catch (error: any) {
            console.error('Không thể gửi OTP:', error.message);
            Alert.alert('Lỗi', 'Không thể gửi OTP: ' + error.data?.message || error.message);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId,
                formData.otp,
            );

            await signInWithCredential(auth, credential);
            setFormData((prev) => ({ ...prev, otp: '' }));
            Alert.alert('Thành công', 'Xác minh OTP thành công!');
            setStep(3);
        } catch (error: any) {
            console.error('Lỗi xác minh OTP:', error);
            Alert.alert('Lỗi', 'Mã OTP không đúng hoặc đã hết hạn');
        }
    };

    const validatePhone = (phoneNumber: string): string => {
        const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phoneNumber) ? '' : 'Số điện thoại không hợp lệ';
    };

    const validateOTP = (otp: string): string => {
        return otp.length === 6 ? '' : 'Mã OTP phải có 6 chữ số';
    };

    const validatePassword = (passWord: string): string => {
        return passWord.length >= 6 ? '' : 'Mật khẩu phải có ít nhất 6 ký tự';
    };

    const validateConfirmPassword = (confirm_password: string): string => {
        return confirm_password === formData.passWord
            ? ''
            : 'Mật khẩu không khớp';
    };

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        switch (name) {
            case 'phoneNumber':
                setErrors((prev) => ({
                    ...prev,
                    phoneNumber: validatePhone(value),
                }));
                break;
            case 'otp':
                setErrors((prev) => ({ ...prev, otp: validateOTP(value) }));
                break;
            case 'passWord':
                setErrors((prev) => ({
                    ...prev,
                    confirm_password: validateConfirmPassword(value),
                }));
                setErrors((prev) => ({
                    ...prev,
                    passWord: validatePassword(value),
                }));
                break;
            case 'confirm_password':
                setErrors((prev) => ({
                    ...prev,
                    confirm_password: validateConfirmPassword(value),
                }));
                break;
            default:
                break;
        }
    };

    const handleStep1Submit = async () => {
        const phoneError = validatePhone(formData.phoneNumber);
        if (!phoneError) {
            try {
                const isExists = await checkPhoneNumber(formData.phoneNumber);
                if (isExists) {
                    await handleSendOTP();
                } else {
                    Alert.alert('Cảnh báo', 'Số điện thoại không tồn tại');
                }
            } catch (error: any) {
                console.log('Lỗi khi kiểm tra số điện thoại', error);
                Alert.alert(
                    'Lỗi',
                    error.data?.message || error.message ||
                        'Lỗi khi kiểm tra số điện thoại!',
                );
            }
        } else {
            setErrors((prev) => ({ ...prev, phoneNumber: phoneError }));
        }
    };

    const handleStep2Submit = async () => {
        const otpError = validateOTP(formData.otp);
        if (!otpError) {
            await handleVerifyOTP();
        } else {
            setErrors((prev) => ({ ...prev, otp: otpError }));
        }
    };

    const handleFinalSubmit = async () => {
        const passwordError = validatePassword(formData.passWord);
        const confirmPasswordError = validateConfirmPassword(
            formData.confirm_password,
        );

        if (!passwordError && !confirmPasswordError) {
            try {
                const response = await forgetPassword({
                    phoneNumber: formData.phoneNumber,
                    newPassWord: formData.passWord,
                    reNewPassWord: formData.confirm_password,
                });
                console.log(
                    'Dữ liệu trả về từ server khi update mật khẩu',
                    response,
                );
                Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
                navigation.navigate('Login');
            } catch (error) {
                console.log('Lỗi khi update mật khẩu', error);
                Alert.alert(
                    'Lỗi',
                    (error as Error).message || 'Lỗi khi đổi mật khẩu!',
                );
            }
        } else {
            setErrors({
                passWord: passwordError,
                confirm_password: confirmPasswordError,
            });
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Số điện thoại'
                            value={formData.phoneNumber}
                            onChangeText={(value) =>
                                handleChange('phoneNumber', value)
                            }
                            keyboardType='phone-pad'
                        />
                        {errors.phoneNumber && (
                            <Text style={styles.errorText}>
                                {errors.phoneNumber}
                            </Text>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                !!errors.phoneNumber && styles.disabledButton,
                            ]}
                            onPress={handleStep1Submit}
                            disabled={!!errors.phoneNumber}
                        >
                            <Text style={styles.buttonText}>Tiếp tục</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.formContainer}>
                        <OTPInput
                            length={6}
                            onChangeOTP={(otp) => {
                                setFormData({ ...formData, otp });
                                handleChange('otp', otp);
                            }}
                            error={errors.otp}
                        />
                        <TouchableOpacity
                            style={[
                                styles.button,
                                (errors.otp !== '' || formData.otp === '') &&
                                    styles.disabledButton,
                            ]}
                            onPress={handleStep2Submit}
                            disabled={errors.otp !== '' || formData.otp === ''}
                        >
                            <Text style={styles.buttonText}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.outlineButton]}
                            onPress={() => setStep(1)}
                        >
                            <Text style={styles.outlineButtonText}>
                                Quay lại
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Mật khẩu mới'
                            value={formData.passWord}
                            onChangeText={(value) =>
                                handleChange('passWord', value)
                            }
                            secureTextEntry
                        />
                        {errors.passWord && (
                            <Text style={styles.errorText}>
                                {errors.passWord}
                            </Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder='Xác nhận mật khẩu mới'
                            value={formData.confirm_password}
                            onChangeText={(value) =>
                                handleChange('confirm_password', value)
                            }
                            secureTextEntry
                        />
                        {errors.confirm_password && (
                            <Text style={styles.errorText}>
                                {errors.confirm_password}
                            </Text>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                (!!errors.passWord ||
                                    !!errors.confirm_password) &&
                                    styles.disabledButton,
                            ]}
                            onPress={handleFinalSubmit}
                            disabled={
                                !!errors.passWord || !!errors.confirm_password
                            }
                        >
                            <Text style={styles.buttonText}>Hoàn tất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.outlineButton]}
                            onPress={() => setStep(2)}
                        >
                            <Text style={styles.outlineButtonText}>
                                Quay lại
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={app.options}
                attemptInvisibleVerification={true}
            />
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.appName}>{APP_INFO.NAME}</Text>
                        <Text style={styles.subtitle}>
                            Đăng ký tài khoản {APP_INFO.NAME}
                        </Text>
                        <Text style={styles.subtitle}>
                            để kết nối với ứng dụng {APP_INFO.NAME} Web
                        </Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.title}>Quên mật khẩu</Text>
                        <Text style={styles.stepText}>Bước {step} / 3</Text>
                        {renderStep()}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Bạn đã có tài khoản {APP_INFO.NAME}?
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.loginLink}>
                                    Đăng nhập ngay
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    stepText: {
        textAlign: 'center',
        marginBottom: 20,
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
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#0078E8',
    },
    outlineButtonText: {
        color: '#0078E8',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        textAlign: 'center',
    },
    loginLink: {
        color: '#0078E8',
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default ForgotPassword;
