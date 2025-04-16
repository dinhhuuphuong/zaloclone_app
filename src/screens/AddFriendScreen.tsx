import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
    Image,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddFriend'>;

export default function AddFriendScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [isBlocked, setIsBlocked] = useState(false);
    const [message, setMessage] = useState(
        "Hi, I'm Hà Anh Thảo. I've got your phone number",
    );

    const toggleSwitch = () => setIsBlocked((previousState) => !previousState);

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCancel}
                >
                    <Ionicons name='close' size={28} color='white' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add friend</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    source={require('../assets/images/225-default-avatar.png')}
                    style={styles.profilePicture}
                />
                <View style={styles.nameContainer}>
                    <Text style={styles.profileName}>Bàn Văn Mười</Text>
                    <TouchableOpacity>
                        <Feather name='edit-2' size={18} color='#666' />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Message Section */}
            <View style={styles.messageSection}>
                <View style={styles.messageInputContainer}>
                    <TextInput
                        style={styles.messageInput}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={150}
                    />
                    <TouchableOpacity style={styles.clearButton}>
                        <Ionicons name='close' size={20} color='#999' />
                    </TouchableOpacity>
                </View>
                <Text style={styles.charCount}>{message.length}/150</Text>
            </View>

            {/* Block Option */}
            <View style={styles.blockSection}>
                <Text style={styles.blockText}>
                    Block this person to view my timeline
                </Text>
                <Switch
                    trackColor={{ false: '#e0e0e0', true: '#81b0ff' }}
                    thumbColor={isBlocked ? '#0084ff' : '#f4f3f4'}
                    ios_backgroundColor='#e0e0e0'
                    onValueChange={toggleSwitch}
                    value={isBlocked}
                />
            </View>

            {/* Send Request Button */}
            <TouchableOpacity style={styles.sendRequestButton}>
                <Text style={styles.sendRequestText}>Send request</Text>
            </TouchableOpacity>
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
        backgroundColor: '#0084ff',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    closeButton: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    messageSection: {
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    messageInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 5,
    },
    clearButton: {
        padding: 5,
    },
    charCount: {
        alignSelf: 'flex-end',
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    blockSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    blockText: {
        fontSize: 16,
    },
    sendRequestButton: {
        backgroundColor: '#0084ff',
        borderRadius: 25,
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    sendRequestText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
