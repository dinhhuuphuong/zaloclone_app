import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import * as ImagePicker from 'expo-image-picker';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    LogBox,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import 'react-native-get-random-values';
import OTPInput from '../components/OTPInput';
import app, { auth } from '../firebase/firebase';
import { register } from '../services/authService';

// Bỏ qua cảnh báo về defaultProps cho FirebaseRecaptcha
LogBox.ignoreLogs([
    'FirebaseRecaptcha: Support for defaultProps will be removed from function components',
]);

// Kiểu dữ liệu cho props navigation
type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Register'
>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}

// Kiểu dữ liệu cho form
interface FormData {
    phoneNumber: string;
    fullName: string;
    passWord: string;
    avatar: File | null;
    gender: boolean;
    dayOfBirth: string;
    otp: string;
    confirm_password: string;
}

interface FormErrors {
    phoneNumber?: string;
    fullName?: string;
    passWord?: string;
    confirm_password?: string;
    dayOfBirth?: string;
    otp?: string;
    avatar?: string;
}

// Render các thành phần UI chung
interface CustomInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    error?: string;
}

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'outline';
}

// Render các thành phần UI chung
const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    error,
}: CustomInputProps) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        phoneNumber: '',
        fullName: '',
        passWord: '',
        avatar: null,
        gender: true,
        dayOfBirth: '',
        otp: '',
        confirm_password: '',
    });

    // Tách state errors thành nhiều state riêng biệt
    const [phoneError, setPhoneError] = useState<string>('');
    const [otpError, setOtpError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] =
        useState<string>('');
    const [dayOfBirthError, setDayOfBirthError] = useState<string>('');
    const [avatarError, setAvatarError] = useState<string>('');

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [verificationId, setVerificationId] = useState<string>('');
    const recaptchaVerifier =
        React.useRef<FirebaseRecaptchaVerifierModal>(null);

    // Validation functions
    const validatePhone = (phoneNumber: string): string => {
        const phoneRegex = /(0[3|5|7|8|9])+(\d{8})\b/;
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

    const validateDayOfBirth = (dayOfBirth: string): string => {
        console.log('🚀 ~ validateDayOfBirth ~ dayOfBirth:', dayOfBirth);
        const dayOfBirthRegex =
            /^(0[1-9]|[12]\d|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
        return dayOfBirthRegex.test(dayOfBirth) ? '' : 'Ngày sinh không hợp lệ';
    };

    // Hàm thay đổi giá trị form
    const handleChange = (name: keyof FormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Không thực hiện validation tức thời cho phoneNumber và otp để tránh re-render
    };

    // Xử lý chọn ảnh đại diện
    const handleAvatarPick = async (): Promise<void> => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Cần quyền truy cập',
                'Vui lòng cấp quyền truy cập thư viện ảnh để tiếp tục',
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            setAvatarPreview(asset.uri);

            const response = await fetch(asset.uri);
            const blob = await response.blob();

            const file = {
                uri: asset.uri,
                name: 'avatar.jpg',
                type: blob.type || 'image/jpeg',
            };

            setFormData((prev) => ({
                ...prev,
                avatar: file as unknown as File,
            }));
        }
    };

    // Gửi OTP
    const handleSendOTP = async (): Promise<void> => {
        try {
            const phoneNumber = '+84' + formData.phoneNumber.slice(1);

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
            Alert.alert(
                'Thành công',
                'Mã OTP đã được gửi đến số điện thoại của bạn',
            );
            setStep(2);
        } catch (error) {
            console.error('Lỗi gửi OTP:', error);
            Alert.alert('Lỗi', 'Không thể gửi OTP. Vui lòng thử lại sau.');
        }
    };

    // Xác minh OTP
    const handleVerifyOTP = async (): Promise<void> => {
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId,
                formData.otp,
            );

            await signInWithCredential(auth, credential);
            setFormData((prev) => ({ ...prev, otp: '' }));
            Alert.alert('Thành công', 'Xác minh OTP thành công!');
            setStep(3);
        } catch (error) {
            console.error('Lỗi xác minh OTP:', error);
            Alert.alert('Lỗi', 'Mã OTP không đúng hoặc đã hết hạn');
        }
    };

    // Xử lý submit bước 1
    const handleStep1Submit = async (): Promise<void> => {
        const error = validatePhone(formData.phoneNumber);
        setPhoneError(error);

        if (!error) {
            await handleSendOTP();
        }
    };

    // Xử lý submit bước 2
    const handleStep2Submit = async (): Promise<void> => {
        const error = validateOTP(formData.otp);
        setOtpError(error);

        if (!error) {
            await handleVerifyOTP();
        }
    };

    // Xử lý submit cuối cùng
    const handleFinalSubmit = async (): Promise<void> => {
        console.log('formData', formData);

        const pwdError = validatePassword(formData.passWord);
        const confirmPwdError = validateConfirmPassword(
            formData.confirm_password,
        );
        const birthError = validateDayOfBirth(formData.dayOfBirth);
        const avatarError = !formData.avatar
            ? 'Vui lòng chọn ảnh đại diện'
            : '';

        setPasswordError(pwdError);
        setConfirmPasswordError(confirmPwdError);
        setDayOfBirthError(birthError);
        setAvatarError(avatarError);

        if (!pwdError && !confirmPwdError && !birthError && !avatarError) {
            try {
                // Chuyển đổi dữ liệu form để phù hợp với API
                const apiFormData = {
                    phoneNumber: formData.phoneNumber || '0987654322',
                    fullName: formData.fullName,
                    passWord: formData.passWord,
                    avatar: formData.avatar,
                    gender: formData.gender,
                    dayOfBirth: formData.dayOfBirth,
                };

                const response = await register(apiFormData);
                console.log('Dữ liệu trả về từ server khi đăng ký', response);
                Alert.alert('Thành công', 'Đăng ký thành công!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]);
            } catch (error) {
                console.error('Lỗi khi đăng ký', JSON.stringify(error));
                Alert.alert(
                    'Lỗi',
                    (error as Error).message || 'Số điện thoại đã tồn tại!',
                );
            }
        }
    };

    const CustomButton = ({
        title,
        onPress,
        disabled = false,
        variant = 'primary',
    }: CustomButtonProps) => (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'outline'
                    ? styles.buttonOutline
                    : styles.buttonPrimary,
                disabled ? styles.buttonDisabled : {},
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text
                style={[
                    styles.buttonText,
                    variant === 'outline'
                        ? styles.buttonTextOutline
                        : styles.buttonTextPrimary,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    // Render step
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.formContainer}>
                        <CustomInput
                            label='Số điện thoại'
                            keyboardType='phone-pad'
                            value={formData.phoneNumber}
                            onChangeText={(text: string) =>
                                handleChange('phoneNumber', text)
                            }
                            error={phoneError}
                            placeholder='Nhập số điện thoại'
                        />
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title='Tiếp tục'
                                onPress={handleStep1Submit}
                                disabled={!!phoneError || !formData.phoneNumber}
                            />
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Nhập mã OTP</Text>
                        <OTPInput
                            length={6}
                            onChangeOTP={(otp) => handleChange('otp', otp)}
                            error={otpError}
                        />
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title='Xác nhận'
                                onPress={handleStep2Submit}
                                disabled={
                                    !!otpError || formData.otp.length !== 6
                                }
                            />
                            <CustomButton
                                title='Quay lại'
                                variant='outline'
                                onPress={() => setStep(1)}
                            />
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.formContainer}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.label}>
                                Ảnh đại diện{' '}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity onPress={handleAvatarPick}>
                                {avatarPreview ? (
                                    <Image
                                        source={{ uri: avatarPreview }}
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Text
                                            style={styles.avatarPlaceholderText}
                                        >
                                            Chọn ảnh
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            {avatarError && (
                                <Text style={styles.errorText}>
                                    {avatarError}
                                </Text>
                            )}
                        </View>

                        <CustomInput
                            label='Tên người dùng'
                            value={formData.fullName}
                            onChangeText={(text: string) =>
                                handleChange('fullName', text)
                            }
                            placeholder='Nhập tên người dùng'
                        />

                        <View style={styles.genderContainer}>
                            <Text style={styles.label}>Giới tính</Text>
                            <View style={styles.radioGroup}>
                                <TouchableOpacity
                                    style={styles.radioOption}
                                    onPress={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            gender: true,
                                        }))
                                    }
                                >
                                    <View
                                        style={[
                                            styles.radioButton,
                                            formData.gender
                                                ? styles.radioButtonSelected
                                                : {},
                                        ]}
                                    >
                                        {formData.gender && (
                                            <View
                                                style={styles.radioButtonInner}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.radioLabel}>Nam</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioOption}
                                    onPress={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            gender: false,
                                        }))
                                    }
                                >
                                    <View
                                        style={[
                                            styles.radioButton,
                                            !formData.gender
                                                ? styles.radioButtonSelected
                                                : {},
                                        ]}
                                    >
                                        {!formData.gender && (
                                            <View
                                                style={styles.radioButtonInner}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.radioLabel}>Nữ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <CustomInput
                            label='Ngày sinh'
                            placeholder='DD/MM/YYYY'
                            value={formData.dayOfBirth}
                            onChangeText={(text: string) =>
                                handleChange('dayOfBirth', text)
                            }
                            error={dayOfBirthError}
                        />

                        <CustomInput
                            label='Mật khẩu'
                            secureTextEntry
                            value={formData.passWord}
                            onChangeText={(text: string) =>
                                handleChange('passWord', text)
                            }
                            error={passwordError}
                            placeholder='Nhập mật khẩu'
                        />

                        <CustomInput
                            label='Xác nhận mật khẩu'
                            secureTextEntry
                            value={formData.confirm_password}
                            onChangeText={(text: string) =>
                                handleChange('confirm_password', text)
                            }
                            error={confirmPasswordError}
                            placeholder='Nhập lại mật khẩu'
                        />

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title='Hoàn tất'
                                onPress={handleFinalSubmit}
                                disabled={
                                    !!passwordError ||
                                    !!confirmPasswordError ||
                                    !!dayOfBirthError ||
                                    !!avatarError ||
                                    !formData.fullName ||
                                    !formData.passWord ||
                                    !formData.confirm_password ||
                                    !formData.dayOfBirth
                                }
                            />
                            <CustomButton
                                title='Quay lại'
                                variant='outline'
                                onPress={() => setStep(2)}
                            />
                        </View>
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

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}>Đăng ký tài khoản</Text>
                {renderStep()}
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0068ff',
        marginBottom: 10,
    },
    formContainer: {
        width: '100%',
        gap: 15,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    errorText: {
        marginTop: 5,
        color: '#ff3b30',
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 20,
        gap: 10,
    },
    button: {
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimary: {
        backgroundColor: '#0068ff',
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#0068ff',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        borderColor: '#cccccc',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonTextPrimary: {
        color: 'white',
    },
    buttonTextOutline: {
        color: '#0068ff',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    avatarPlaceholderText: {
        color: '#666',
        fontSize: 14,
    },
    genderContainer: {
        marginBottom: 15,
    },
    radioGroup: {
        flexDirection: 'row',
        marginTop: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioButtonSelected: {
        borderColor: '#0068ff',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#0068ff',
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
    },
    required: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
