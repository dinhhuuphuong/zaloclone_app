import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import {
    deleteMessage as deleteMessageInGroup,
    revokeMessage as revokeMessageInGroup,
} from '../services/groupService';
import { deleteMessage, revokeMessage } from '../services/messageService';
import useChatStore from '../stores/chatStore';
import useConversationsStore from '../stores/conversationsStore';
import useGroupStore from '../stores/groupStore';
import { IMessage } from '../stores/messagesStore';
import { parseTimestamp, showError } from '../utils';
import { Avatar } from './Avatar';
import { IMessageMedia, MessageMedia } from './MessageMedia';
import ReplyMessage from './ReplyMessage';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShareMessage'>;

const Message = ({
    isReply = false,
    isOther,
    message,
    setReplyMessage,
}: {
    isReply?: boolean;
    isOther: boolean;
    message: IMessage;
    setReplyMessage: (message: IMessage) => void;
}) => {
    const navigation = useNavigation<NavigationProp>();
    const { chat } = useChatStore();
    const { group } = useGroupStore();
    const [modalVisible, setModalVisible] = useState(false);
    const isRevoked = message.revoke;
    const isDeletedBySender = message.senderDelete && !isOther;
    const isShowMessage = !isRevoked && !isDeletedBySender;
    const messageDetails: Array<IMessageMedia> = useMemo(() => {
        if (message.messageType === 'text' || message.reply) return [];

        try {
            const urls = JSON.parse(message.messageUrl);
            const types = JSON.parse(message.messageType);
            const contents = JSON.parse(message.messageContent);

            return urls.map((url: string, index: number) => ({
                url: url.trim(),
                type: types[index],
                content: contents[index],
            }));
        } catch (error) {
            return [
                {
                    url: message.messageUrl,
                    type: message.messageType,
                    content: message.messageContent,
                },
            ];
        }
    }, [message]);
    const member = useMemo(() => {
        if (!chat || !chat.conversationID || !group[chat.conversationID])
            return null;

        return group[chat.conversationID].find(
            (member) => member.userID === message.senderID,
        );
    }, [chat, message.senderID]);
    const { conversations: conversationList } = useConversationsStore();
    const conversation = useMemo(() => {
        if (!conversationList) return null;

        return conversationList.find(
            (conversation) =>
                conversation.conversation.conversationID ===
                chat?.conversationID,
        );
    }, [conversationList, chat?.conversationID]);
    const isGroup = conversation?.conversation.conversationType === 'group';

    const handleDeleteMessage = async () => {
        try {
            if (isGroup)
                await deleteMessageInGroup(
                    message.messageID,
                    message.conversationID,
                );
            else await deleteMessage(message.messageID, message.conversationID);
        } catch (error) {
            showError(error, 'Có lỗi xảy ra khi xóa tin nhắn');
        } finally {
            setModalVisible(false);
        }
    };

    const handleRecallMessage = async () => {
        try {
            if (isGroup)
                await revokeMessageInGroup(
                    message.messageID,
                    message.conversationID,
                );
            else
                await revokeMessage(
                    chat?.userID ?? '',
                    message.messageID,
                    message.conversationID,
                );
        } catch (error) {
            showError(error, 'Không thể thu hồi tin nhắn');
        } finally {
            setModalVisible(false);
        }
    };

    const handleShareMessage = () => {
        navigation.navigate('ShareMessage', message);
        setModalVisible(false);
    };

    const handleShowModal = () => {
        if (isRevoked || isDeletedBySender) return;

        setModalVisible(true);
    };

    const handleReplyMessage = (message: IMessage) => {
        setReplyMessage(message);
        setModalVisible(false);
    };

    return (
        <View
            style={[
                styles.messageRow,
                isOther ? styles.userMessageRow : styles.contactMessageRow,
            ]}
        >
            {isOther && !isReply && (
                <View style={styles.pr8}>
                    <Avatar avatar={member?.avatar} />
                </View>
            )}
            <Pressable
                onLongPress={handleShowModal}
                style={[
                    styles.messageContainer,
                    isReply
                        ? {
                              width: '100%',
                          }
                        : isOther
                        ? styles.userMessage
                        : styles.contactMessage,
                ]}
            >
                {!isReply && isOther && member?.fullName && (
                    <Text style={[styles.secondaryText, styles.mb5]}>
                        {member?.fullName}
                    </Text>
                )}

                {isShowMessage || (
                    <Text style={styles.secondaryText}>
                        {isRevoked
                            ? 'Tin nhắn đã được thu hồi'
                            : 'Bạn đã xoá tin nhắn này'}
                    </Text>
                )}

                {isShowMessage && message.reply && (
                    <ReplyMessage message={message} />
                )}

                {isShowMessage && <MessageMedia medias={messageDetails} />}

                {isShowMessage && message.messageType === 'sticker' && (
                    <Text style={styles.messageText}>Sticker</Text>
                )}
                {isShowMessage &&
                    message.messageContent &&
                    messageDetails.length === 0 && (
                        <Text style={styles.messageText}>
                            {message.messageContent}
                        </Text>
                    )}
                {isReply || (
                    <Text style={styles.timeText}>
                        {parseTimestamp(message.createdAt)}
                    </Text>
                )}
            </Pressable>

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Pressable
                            style={styles.modalOption}
                            onPress={() => handleReplyMessage(message)}
                        >
                            <Text style={styles.modalOptionText}>Trả lời</Text>
                        </Pressable>
                        {isOther || (
                            <>
                                <Pressable
                                    style={styles.modalOption}
                                    onPress={handleDeleteMessage}
                                >
                                    <Text style={styles.modalOptionText}>
                                        Xóa tin nhắn
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={styles.modalOption}
                                    onPress={handleRecallMessage}
                                >
                                    <Text style={styles.modalOptionText}>
                                        Thu hồi tin nhắn
                                    </Text>
                                </Pressable>
                            </>
                        )}
                        <Pressable
                            style={styles.modalOption}
                            onPress={handleShareMessage}
                        >
                            <Text style={styles.modalOptionText}>
                                Chia sẻ tin nhắn
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.modalOption, styles.cancelOption]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Hủy</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    pr8: {
        paddingRight: 8,
    },
    mb5: {
        marginBottom: 5,
    },
    messageRow: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start',
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
    messageImagesContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    messageImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 5,
    },
    video: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
    },
    pdfContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    pdfText: {
        fontSize: 16,
        color: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#000',
    },
    cancelOption: {
        marginTop: 10,
        borderBottomWidth: 0,
    },
    cancelText: {
        fontSize: 16,
        color: '#ff3b30',
        textAlign: 'center',
    },
    secondaryText: {
        color: '#99a1af',
        fontStyle: 'italic',
    },
    receivedBubble: {
        backgroundColor: '#e1f5fe',
        borderRadius: 16,
        width: '100%',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    sentBubble: {
        backgroundColor: '#dcf8c6',
        borderRadius: 16,
        maxWidth: '80%',
        padding: 12,
    },
    leftAccent: {
        width: 4,
        backgroundColor: '#2196f3',
    },
    contentContainer: {
        padding: 12,
        paddingLeft: 16,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 2,
    },
    subtitleText: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
});
