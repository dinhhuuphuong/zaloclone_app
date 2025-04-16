import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { searchUserByPhoneNumber } from '../services/apiFunctionsUser';
import { showError } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddFriend'>;

export default function AddFriendsScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode] = useState('+84');
    const navigation = useNavigation<NavigationProp>();

    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleNext = async () => {
        if (!isValidPhoneNumber(phoneNumber)) return;

        try {
            const user = await searchUserByPhoneNumber(phoneNumber);

            navigation.navigate('OtherUserProfile', user);
        } catch (error) {
            showError(error, 'Error searching user by phone number');
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleCancel}
                >
                    <Ionicons name='chevron-back' size={24} color='#000' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Friends</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* QR Code Card */}
                <View style={styles.qrCardContainer}>
                    <View style={styles.qrCard}>
                        <Text style={styles.qrCardName}>Hà Anh Thảo</Text>
                        <Image
                            source={require('../assets/images/qr-code.png')}
                            style={styles.qrCode}
                        />
                        <Text style={styles.qrCardText}>
                            Quét mã để thêm bạn Zalo với tôi
                        </Text>
                    </View>
                </View>

                {/* Phone Number Input */}
                <View style={styles.phoneInputContainer}>
                    <TouchableOpacity style={styles.countryCodeButton}>
                        <Text style={styles.countryCodeText}>
                            {countryCode}
                        </Text>
                        <Ionicons name='chevron-down' size={16} color='#666' />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.phoneInput}
                        placeholder='Enter phone number'
                        placeholderTextColor='#999'
                        keyboardType='phone-pad'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleNext}
                    >
                        <Ionicons
                            name='arrow-forward'
                            size={24}
                            color={
                                isValidPhoneNumber(phoneNumber)
                                    ? '#0066cc'
                                    : '#999'
                            }
                        />
                    </TouchableOpacity>
                </View>

                {/* Menu Options */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <MaterialCommunityIcons
                                name='qrcode-scan'
                                size={24}
                                color='#0066cc'
                            />
                        </View>
                        <Text style={styles.menuText}>Scan QR code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <FontAwesome5
                                name='address-book'
                                size={20}
                                color='#0066cc'
                            />
                        </View>
                        <Text style={styles.menuText}>Phonebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <MaterialIcons
                                name='people'
                                size={24}
                                color='#0066cc'
                            />
                        </View>
                        <Text style={styles.menuText}>People you may know</Text>
                    </TouchableOpacity>
                </View>

                {/* View Sent Requests */}
                <TouchableOpacity style={styles.viewRequestsContainer}>
                    <Text style={styles.viewRequestsText}>
                        View sent friend requests in Contacts
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    qrCardContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    qrCard: {
        width: 300,
        height: 320,
        backgroundColor: '#3b5998',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    qrCardName: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    qrCode: {
        width: 180,
        height: 180,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    qrCardText: {
        color: 'white',
        marginTop: 15,
        fontSize: 14,
        textAlign: 'center',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 30,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    countryCodeText: {
        fontSize: 16,
        marginRight: 5,
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    submitButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    menuContainer: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIconContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
    },
    viewRequestsContainer: {
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 15,
    },
    viewRequestsText: {
        color: '#666',
        fontSize: 14,
    },
});
