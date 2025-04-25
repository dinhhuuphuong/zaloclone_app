import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { deleteMessage, revokeMessage } from '../services/messageService';
import useChatStore from '../stores/chatStore';
import { IMessage } from '../stores/messagesStore';
import { parseTimestamp, showError } from '../utils';
import { IMessageMedia, MessageMedia } from './MessageMedia';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShareMessage'>;

const Message = ({
    isOther,
    message,
}: {
    isOther: boolean;
    message: IMessage;
}) => {
    const navigation = useNavigation<NavigationProp>();
    const { chat } = useChatStore();
    const [modalVisible, setModalVisible] = useState(false);
    const isRevoked = message.revoke;
    const isDeletedBySender = message.senderDelete && !isOther;
    const isShowMessage = !isRevoked && !isDeletedBySender;
    const messageDetails: Array<IMessageMedia> = useMemo(() => {
        if (message.messageType === 'text') return [];

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

    const handleDeleteMessage = async () => {
        try {
            await deleteMessage(message.messageID, message.conversationID);
        } catch (error) {
            showError(error, 'Có lỗi xảy ra khi xóa tin nhắn');
        } finally {
            setModalVisible(false);
        }
    };

    const handleRecallMessage = async () => {
        try {
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

    return (
        <View
            style={[
                styles.messageRow,
                isOther ? styles.userMessageRow : styles.contactMessageRow,
            ]}
        >
            <Pressable
                onLongPress={handleShowModal}
                style={[
                    styles.messageContainer,
                    isOther ? styles.userMessage : styles.contactMessage,
                ]}
            >
                {isShowMessage || (
                    <Text style={styles.secondaryText}>
                        {isRevoked
                            ? 'Tin nhắn đã được thu hồi'
                            : 'Bạn đã xoá tin nhắn này'}
                    </Text>
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
                <Text style={styles.timeText}>
                    {parseTimestamp(message.createdAt)}
                </Text>
            </Pressable>

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
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
    messageRow: {
        width: '100%',
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
});
