import {
    Feather,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    SimpleLineIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendTextMessage } from '../services/messageService';
import useChatStore from '../stores/chatStore';
import useUserOnlineStore from '../stores/userOnlineStore';

// Define types for our messages
type MessageType = {
    id: string;
    text?: string;
    time: string;
    date?: string;
    isUser: boolean;
    isSticker?: boolean;
    stickerUrl?: string;
    reactions?: {
        type: string;
        count: number;
    }[];
    status?: 'sent' | 'delivered' | 'read';
};

export default function ChatScreen() {
    const [message, setMessage] = useState('');
    const [showSendButton, setShowSendButton] = useState(false);
    const navigation = useNavigation();
    const { chat } = useChatStore();
    const { userOnline } = useUserOnlineStore();
    const isOnline = userOnline?.userIds.includes(chat?.userID ?? '');

    const handleMessageChange = (text: string) => {
        setMessage(text);
        setShowSendButton(text.trim().length > 0);
    };

    // Sample messages data
    const messages: MessageType[] = [
        {
            id: '1',
            text: 'Chứ m muốn sao nữa ba',
            time: '17:47',
            isUser: false,
        },
        {
            id: '2',
            text: 'nó đó',
            time: '17:49',
            isUser: true,
        },
        {
            id: '3',
            text: 'thì nó đó',
            time: '17:49',
            isUser: true,
        },
        {
            id: '4',
            isSticker: true,
            stickerUrl: 'https://via.placeholder.com/150',
            time: '17:49',
            isUser: true,
        },
        {
            id: '5',
            text: '',
            time: '',
            date: '22:47 14/04/2025',
            isUser: false,
        },
        {
            id: '6',
            text: 'tạo cuộc hội thoại bằng cái api nào á Thảo?',
            time: '',
            isUser: true,
        },
        {
            id: '7',
            text: '',
            time: '',
            date: '23:21 14/04/2025',
            isUser: false,
        },
        {
            id: '8',
            text: 'ê, sáng mai cho t xin lịch vô meet đi',
            time: '',
            isUser: true,
        },
        {
            id: '9',
            text: '',
            time: '',
            date: '07:33 Yesterday',
            isUser: false,
        },
        {
            id: '10',
            text: 'phần chat fe t có code r mà',
            time: '',
            isUser: false,
            reactions: [{ type: 'heart', count: 1 }],
            status: 'delivered',
        },
    ];

    const handleSendTextMessage = async () => {
        if (!message.trim()) return;

        try {
            const response = await sendTextMessage(chat?.userID ?? '', message);
            setMessage('');

            console.log('response', response);
        } catch (err) {
            console.error('Lỗi khi gửi tin nhắn:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar backgroundColor='#0084ff' />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name='chevron-back' size={24} color='white' />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerName}>{chat?.fullName}</Text>
                        <Text style={styles.headerStatus}>
                            {isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name='call-outline' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons
                            name='videocam-outline'
                            size={24}
                            color='white'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <SimpleLineIcons
                            name='options-vertical'
                            size={20}
                            color='white'
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat Messages */}
            <ScrollView
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
            >
                {messages.map((msg) => {
                    if (msg.date) {
                        return (
                            <View key={msg.id} style={styles.dateContainer}>
                                <View style={styles.dateWrapper}>
                                    <Text style={styles.dateText}>
                                        {msg.date}
                                    </Text>
                                </View>
                            </View>
                        );
                    }

                    return (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageRow,
                                msg.isUser
                                    ? styles.userMessageRow
                                    : styles.contactMessageRow,
                            ]}
                        >
                            {msg.isUser && (
                                <Image
                                    source={{
                                        uri: 'https://via.placeholder.com/40',
                                    }}
                                    style={styles.avatar}
                                />
                            )}
                            <View
                                style={[
                                    styles.messageContainer,
                                    msg.isUser
                                        ? styles.userMessage
                                        : styles.contactMessage,
                                ]}
                            >
                                {msg.isSticker ? (
                                    <Text style={styles.messageText}>
                                        Sticker
                                    </Text>
                                ) : (
                                    <Text style={styles.messageText}>
                                        {msg.text}
                                    </Text>
                                )}
                                {msg.time && (
                                    <Text style={styles.timeText}>
                                        {msg.time}
                                    </Text>
                                )}
                                {msg.reactions && (
                                    <View style={styles.reactionContainer}>
                                        <Text style={styles.reactionText}>
                                            ❤️ {msg.reactions[0].count}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {!msg.isUser && msg.reactions && (
                                <TouchableOpacity style={styles.heartButton}>
                                    <Ionicons
                                        name='heart-outline'
                                        size={20}
                                        color='#666'
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
                {/* Status indicator */}
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                        <Ionicons
                            name='checkmark-done'
                            size={14}
                            color='#8e8e8e'
                        />{' '}
                        Delivered
                    </Text>
                </View>
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.inputContainer}
            >
                <TouchableOpacity style={styles.emojiButton}>
                    <MaterialCommunityIcons
                        name='emoticon-outline'
                        size={24}
                        color='#666'
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder='Message'
                    placeholderTextColor='#999'
                    value={message}
                    onChangeText={handleMessageChange}
                    multiline
                />
                {showSendButton ? (
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendTextMessage}
                    >
                        <Ionicons name='send' size={24} color='#0084ff' />
                    </TouchableOpacity>
                ) : (
                    <Fragment>
                        <TouchableOpacity style={styles.moreButton}>
                            <Feather
                                name='more-horizontal'
                                size={24}
                                color='#666'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.voiceButton}>
                            <FontAwesome
                                name='microphone'
                                size={24}
                                color='#666'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.stickerButton}>
                            <MaterialIcons
                                name='gif'
                                size={24}
                                color='#ff9500'
                            />
                        </TouchableOpacity>
                    </Fragment>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e5ea',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0084ff',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    headerStatus: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#e5e5ea',
    },
    messagesContent: {
        padding: 10,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    userMessageRow: {
        justifyContent: 'flex-start',
    },
    contactMessageRow: {
        justifyContent: 'flex-end',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    messageContainer: {
        maxWidth: '70%',
        borderRadius: 18,
        padding: 10,
        marginBottom: 2,
    },
    userMessage: {
        backgroundColor: 'white',
    },
    contactMessage: {
        backgroundColor: '#dcf8ff',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    timeText: {
        fontSize: 11,
        color: '#8e8e8e',
        alignSelf: 'flex-end',
        marginTop: 2,
    },
    stickerImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    dateContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    dateWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
    },
    dateText: {
        color: 'white',
        fontSize: 12,
    },
    reactionContainer: {
        position: 'absolute',
        bottom: -10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    reactionText: {
        fontSize: 12,
    },
    heartButton: {
        marginLeft: 5,
    },
    statusContainer: {
        alignItems: 'flex-end',
        marginTop: 5,
        marginRight: 10,
    },
    statusText: {
        fontSize: 12,
        color: '#8e8e8e',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    emojiButton: {
        padding: 5,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    moreButton: {
        padding: 5,
    },
    voiceButton: {
        padding: 5,
    },
    stickerButton: {
        padding: 5,
    },
    sendButton: {
        padding: 5,
        marginLeft: 5,
    },
});
