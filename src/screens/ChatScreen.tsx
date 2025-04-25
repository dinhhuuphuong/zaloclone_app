import {
    Feather,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    SimpleLineIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import OutsidePressHandler from 'react-native-outside-press';
import { SafeAreaView } from 'react-native-safe-area-context';
import Message from '../components/Message';
import { RootStackParamList } from '../navigation/types';
import { getMembersOfGroup, sendMessage } from '../services/groupService';
import {
    getMessagesByConversation,
    sendFiles,
    sendTextMessage,
} from '../services/messageService';
import useChatStore from '../stores/chatStore';
import useConversationsStore from '../stores/conversationsStore';
import useGroupStore from '../stores/groupStore';
import useMessagesStore from '../stores/messagesStore';
import useUserOnlineStore from '../stores/userOnlineStore';
import { toGroupMembers } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Options'>;

export default function ChatScreen() {
    const [message, setMessage] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const navigation = useNavigation<NavigationProp>();
    const { chat, setConversationID } = useChatStore();
    const { group, setMembers } = useGroupStore();
    const { userOnline } = useUserOnlineStore();
    const isOnline = userOnline?.userIds.includes(chat?.userID ?? '');
    const { conversations, setMessages } = useMessagesStore();
    const messages = conversations[chat?.conversationID ?? ''] ?? [];
    const { addConversation, conversations: conversationList } =
        useConversationsStore();
    const scrollViewRef = useRef<ScrollView>(null);
    const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);
    const conversation = useMemo(() => {
        if (!conversationList) return null;

        return conversationList.find(
            (conversation) =>
                conversation.conversation.conversationID ===
                chat?.conversationID,
        );
    }, [conversationList, chat?.conversationID]);
    console.log('members', chat?.conversationID && group[chat?.conversationID]);
    const isGroup = conversation?.conversation.conversationType === 'group';

    const handleMessageChange = useCallback((text: string) => {
        setMessage(text);
    }, []);

    const handleSendFileMessage = useCallback(async () => {
        if (selectedImages.length === 0) return;

        try {
            const response = await sendFiles(chat?.userID ?? '', files);

            setFiles([]);
            setSelectedImages([]);
            setShowImagePreview(false);

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
            console.error('Lỗi khi gửi file:', err);
        }
    }, [selectedImages.length, files, chat]);

    const handleSendTextMessage = useCallback(async () => {
        if (!message.trim()) return;

        try {
            if (conversation?.conversation.conversationType === 'group') {
                if (chat?.conversationID === undefined) return;
                await sendMessage({
                    groupID: chat?.conversationID,
                    message,
                });
            } else {
                const response = await sendTextMessage(
                    chat?.userID ?? '',
                    message,
                );

                if (response.createConversation?.conversationID) {
                    setConversationID(
                        response.createConversation.conversationID,
                    );
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
            }

            setMessage('');
        } catch (err) {
            console.error('Lỗi khi gửi tin nhắn:', err);
        }
    }, [message, chat]);

    const pickImage = useCallback(async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => asset.uri);
            setSelectedImages(newImages);
            setShowImagePreview(true);

            const newFiles = await Promise.all(
                result.assets.map(async (asset) => {
                    const response = await fetch(asset.uri);
                    const blob = await response.blob();

                    const file = {
                        uri: asset.uri,
                        name: 'image.jpg',
                        type: blob.type || 'image/jpeg',
                    };

                    return file;
                }),
            );

            setFiles(newFiles as any[]);
        }
    }, []);

    const handleSendFiles = useCallback(
        async (file: File) => {
            try {
                const response = await sendFiles(chat?.userID ?? '', [
                    file as any,
                ]);

                if (response.createConversation?.conversationID) {
                    setConversationID(
                        response.createConversation.conversationID,
                    );
                    addConversation({
                        conversation: {
                            ...response.createConversation,
                            receiver: chat,
                        },
                        lastMessage: response.createNewMessage,
                    });
                }
            } catch (err) {
                console.error('Lỗi khi gửi file:', err);
                alert('Có lỗi xảy ra khi gửi file');
            }
        },
        [chat],
    );

    const pickFile = useCallback(async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const file = {
                    uri: result.assets[0].uri,
                    name: result.assets[0].name,
                    type:
                        result.assets[0].mimeType ?? 'application/octet-stream',
                };

                Alert.alert(
                    'Xác nhận gửi file',
                    'Bạn có chắc chắn muốn gửi file này?',
                    [
                        {
                            text: 'Hủy',
                            style: 'cancel',
                        },
                        {
                            text: 'Gửi',
                            onPress: async () => {
                                await handleSendFiles(file as any);
                            },
                        },
                    ],
                );
            }
        } catch (err) {
            console.error('Lỗi khi chọn file:', err);
            alert('Có lỗi xảy ra khi chọn file');
        }
    }, []);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
        }, 100);
    }, []);

    const handleEmojiSelect = useCallback(
        (emoji: string) => {
            const newText =
                message.substring(0, selection.start) +
                emoji +
                message.substring(selection.end);
            setMessage(newText);
            const newPosition = selection.start + emoji.length;
            setSelection({ start: newPosition, end: newPosition });
        },
        [message, selection],
    );

    const handleShowEmoji = useCallback(() => {
        Keyboard.dismiss();
        setIsOpenEmoji(true);
    }, []);

    const handleHideEmoji = useCallback(() => {
        setIsOpenEmoji(false);
    }, []);

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

    useEffect(() => {
        if (!chat?.conversationID) return;
        scrollToBottom();
    }, [chat?.conversationID]);

    useEffect(() => {
        const fetchMembers = async (id: string) => {
            const res = await getMembersOfGroup(id);

            setMembers(id, toGroupMembers(res));
        };

        if (
            conversation?.conversation?.conversationID &&
            conversation?.conversation?.conversationType === 'group' &&
            !group[conversation?.conversation?.conversationID]
        ) {
            fetchMembers(conversation?.conversation?.conversationID);
        }
    }, [conversation?.conversation?.conversationID]);

    useEffect(() => {
        if (!chat) navigation.navigate('Home');
    }, [chat]);

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
                        {conversation?.conversation.conversationType ===
                            'single' && (
                            <Text style={styles.headerStatus}>
                                {isOnline ? 'Online' : 'Offline'}
                            </Text>
                        )}
                        {conversation?.conversation.conversationType ===
                            'group' &&
                            chat?.conversationID &&
                            group[chat.conversationID] && (
                                <Text style={styles.headerStatus}>
                                    {group[chat.conversationID]?.length} thành
                                    viên
                                </Text>
                            )}
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
                    {isGroup && (
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => navigation.navigate('Options')}
                        >
                            <SimpleLineIcons
                                name='options-vertical'
                                size={20}
                                color='white'
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Image Preview Modal */}
            <Modal
                visible={showImagePreview}
                transparent={true}
                animationType='slide'
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView horizontal style={styles.previewScrollView}>
                            {selectedImages.map((imageUri, index) => (
                                <View
                                    key={index}
                                    style={styles.previewImageContainer}
                                >
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={styles.previewImage}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setSelectedImages([]);
                                    setShowImagePreview(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.sendButton]}
                                onPress={() => {
                                    setShowImagePreview(false);
                                    handleSendFileMessage();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        styles.sendButtonText,
                                    ]}
                                >
                                    Gửi
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Chat Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
                showsVerticalScrollIndicator={false}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 10,
                }}
            >
                {messages.map((msg) => (
                    <Message
                        isOther={msg.senderID === chat?.userID}
                        key={msg.messageID}
                        message={msg}
                    />
                ))}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.inputContainer}
            >
                <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={handleShowEmoji}
                >
                    <MaterialCommunityIcons
                        name='emoticon-outline'
                        size={24}
                        color='#666'
                    />
                </TouchableOpacity>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder='Message'
                    placeholderTextColor='#999'
                    value={message}
                    onChangeText={handleMessageChange}
                    onSelectionChange={(e) =>
                        setSelection(e.nativeEvent.selection)
                    }
                    selection={selection}
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
                        <TouchableOpacity
                            style={styles.moreButton}
                            onPress={pickImage}
                        >
                            <Feather name='image' size={24} color='#666' />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.voiceButton}>
                            <FontAwesome
                                name='microphone'
                                size={24}
                                color='#666'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.stickerButton}
                            onPress={pickFile}
                        >
                            <MaterialIcons
                                name='attach-file'
                                size={24}
                                color='#666'
                            />
                        </TouchableOpacity>
                    </Fragment>
                )}
            </KeyboardAvoidingView>
            {isOpenEmoji && (
                <OutsidePressHandler
                    style={styles.emojiContainer}
                    onOutsidePress={handleHideEmoji}
                >
                    <EmojiSelector onEmojiSelected={handleEmojiSelect} />
                </OutsidePressHandler>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    emojiContainer: {
        height: 300,
    },
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
        width: '100%',
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
    },
    previewScrollView: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    previewImageContainer: {
        marginRight: 10,
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalButtonText: {
        fontSize: 16,
        color: '#666',
    },
    sendButtonText: {
        color: '#0084ff',
    },
    emojiSelectorOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
});
