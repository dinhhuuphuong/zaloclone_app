import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from 'react-native';
import { v4 } from 'uuid';

interface OTPInputProps {
    length?: number;
    onChangeOTP: (otp: string) => void;
    error?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
    length = 6,
    onChangeOTP,
    error,
}) => {
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [otpValues, setOtpValues] = useState<string[]>(
        Array(length).fill(''),
    );

    const handleChange = (value: string, index: number) => {
        // Nếu không phải là số, bỏ qua
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Cập nhật giá trị OTP
        const newOtpValues = [...otpValues];

        // Nếu có nhiều ký tự, chỉ lấy ký tự đầu tiên
        if (value.length > 0) {
            newOtpValues[index] = value[0];
        } else {
            newOtpValues[index] = '';
        }

        setOtpValues(newOtpValues);

        // Gọi callback với OTP mới
        onChangeOTP(newOtpValues.join(''));

        // Di chuyển đến ô tiếp theo nếu người dùng nhập một số
        if (value.length > 0 && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number,
    ) => {
        const key = e.nativeEvent.key;

        // Nếu là nút Backspace và ô hiện tại trống, di chuyển đến ô trước đó
        if (key === 'Backspace') {
            // Nếu ô hiện tại đã trống và không phải ô đầu tiên, focus vào ô trước đó
            if (otpValues[index] === '' && index > 0) {
                inputRefs.current[index - 1]?.focus();

                // Xóa giá trị ở ô trước đó
                const newOtpValues = [...otpValues];
                newOtpValues[index - 1] = '';
                setOtpValues(newOtpValues);
                onChangeOTP(newOtpValues.join(''));
            }
            // Nếu ô hiện tại có giá trị, xóa giá trị hiện tại
            else if (otpValues[index] !== '') {
                const newOtpValues = [...otpValues];
                newOtpValues[index] = '';
                setOtpValues(newOtpValues);
                onChangeOTP(newOtpValues.join(''));
            }
            // Nếu đã xóa giá trị hiện tại, tự động quay về ô trước đó
            else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={(el) => (inputRefs.current[0] = el)}
                    style={[styles.input, error ? styles.inputError : {}]}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={otpValues[0]}
                    onChangeText={(value) => handleChange(value, 0)}
                    onKeyPress={(e) => handleKeyPress(e, 0)}
                    selectionColor='#3498db'
                />
                <TextInput
                    ref={(el) => (inputRefs.current[1] = el)}
                    style={[styles.input, error ? styles.inputError : {}]}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={otpValues[1]}
                    onChangeText={(value) => handleChange(value, 1)}
                    onKeyPress={(e) => handleKeyPress(e, 1)}
                    selectionColor='#3498db'
                />
                <TextInput
                    ref={(el) => (inputRefs.current[2] = el)}
                    style={[styles.input, error ? styles.inputError : {}]}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={otpValues[2]}
                    onChangeText={(value) => handleChange(value, 2)}
                    onKeyPress={(e) => handleKeyPress(e, 2)}
                    selectionColor='#3498db'
                />
                <TextInput
                    ref={(el) => (inputRefs.current[3] = el)}
                    style={[styles.input, error ? styles.inputError : {}]}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={otpValues[3]}
                    onChangeText={(value) => handleChange(value, 3)}
                    onKeyPress={(e) => handleKeyPress(e, 3)}
                    selectionColor='#3498db'
                />
                <TextInput
                    ref={(el) => (inputRefs.current[4] = el)}
                    style={[styles.input, error ? styles.inputError : {}]}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={otpValues[4]}
                    onChangeText={(value) => handleChange(value, 4)}
                    onKeyPress={(e) => handleKeyPress(e, 4)}
                    selectionColor='#3498db'
                />
                <TextInput
                    ref={(el) => (inputRefs.current[5] = el)}
                    style={[styles.input, error ? styles.inputError : {}]}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={otpValues[5]}
                    onChangeText={(value) => handleChange(value, 5)}
                    onKeyPress={(e) => handleKeyPress(e, 5)}
                    selectionColor='#3498db'
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 45,
        height: 45,
        margin: 5,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        marginTop: 8,
        color: '#ff3b30',
        fontSize: 14,
    },
});

export default OTPInput;
