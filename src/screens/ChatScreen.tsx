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
import { Fragment, useEffect, useState } from 'react';
import {
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
import {
    getMessagesByConversation,
    sendTextMessage,
} from '../services/messageService';
import useChatStore from '../stores/chatStore';
import useConversationsStore from '../stores/conversationsStore';
import useMessagesStore from '../stores/messagesStore';
import useUserOnlineStore from '../stores/userOnlineStore';
import { parseTimestamp } from '../utils';

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
    const { chat, setConversationID } = useChatStore();
    const { userOnline } = useUserOnlineStore();
    const isOnline = userOnline?.userIds.includes(chat?.userID ?? '');
    const { conversations, setMessages } = useMessagesStore();
    const messages = conversations[chat?.conversationID ?? ''] ?? [];
    const { addConversation } = useConversationsStore();

    const handleMessageChange = (text: string) => {
        setMessage(text);
        setShowSendButton(text.trim().length > 0);
    };

    const handleSendTextMessage = async () => {
        if (!message.trim()) return;

        try {
            const response = await sendTextMessage(chat?.userID ?? '', message);
            setMessage('');

            if (response.createConversation?.conversationID) {
                setConversationID(response.createConversation.conversationID);
                addConversation({
                    conversation: {
                        ...response.createConversation,
                        receiver: {
                            ...chat,
                        },
                    },
                    lastMessage: {
                        ...response.createNewMessage,
                    },
                });
            }
        } catch (err) {
            console.error('Lỗi khi gửi tin nhắn:', err);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!chat?.conversationID) return;

            const response = await getMessagesByConversation(
                chat.conversationID,
            );

            setMessages(chat.conversationID, [...response].reverse());
        };

        fetchMessages();
    }, [chat?.conversationID]);

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
                    return (
                        <View
                            key={msg.messageID}
                            style={[
                                styles.messageRow,
                                msg.senderID === chat?.userID
                                    ? styles.userMessageRow
                                    : styles.contactMessageRow,
                            ]}
                        >
                            {/* {msg.senderID === chat?.userID && (
                                <Image
                                    source={{
                                        uri: 'https://via.placeholder.com/40',
                                    }}
                                    style={styles.avatar}
                                />
                            )} */}
                            <View
                                style={[
                                    styles.messageContainer,
                                    msg.senderID === chat?.userID
                                        ? styles.userMessage
                                        : styles.contactMessage,
                                ]}
                            >
                                {msg.messageType === 'sticker' ? (
                                    <Text style={styles.messageText}>
                                        Sticker
                                    </Text>
                                ) : (
                                    <Text style={styles.messageText}>
                                        {msg.messageContent}
                                    </Text>
                                )}
                                <Text style={styles.timeText}>
                                    {parseTimestamp(msg.createdAt)}
                                </Text>
                            </View>
                        </View>
                    );
                })}
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
                {message ? (
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
