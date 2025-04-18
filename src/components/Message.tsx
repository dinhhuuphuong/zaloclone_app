import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { deleteMessage, revokeMessage } from '../services/messageService';
import useChatStore from '../stores/chatStore';
import { IMessage } from '../stores/messagesStore';
import { parseTimestamp, showError } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShareMessage'>;

const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const videoTypes = ['mp4', 'webm', 'mov'];

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
    const isImage = imageTypes.includes(message.messageType?.toLowerCase());
    const isVideo = videoTypes.includes(message.messageType?.toLowerCase());
    const isPDF = message.messageType?.toLowerCase() === 'pdf';
    const player = useVideoPlayer(message.messageUrl, (player) => {
        player.loop = true;
        player.play();
    });
    const isRevoked = message.revoke;
    const isDeletedBySender = message.senderDelete && !isOther;
    const isShowMessage = !isRevoked && !isDeletedBySender;

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    const handleOpenPDF = async () => {
        try {
            const canOpen = await Linking.canOpenURL(message.messageUrl);
            if (canOpen) {
                await Linking.openURL(message.messageUrl);
            } else {
                console.error('Cannot open PDF file');
            }
        } catch (error) {
            console.error('Error opening PDF:', error);
        }
    };

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

    useEffect(() => {
        if (!isVideo) return;

        if (isPlaying) {
            player.play();
        } else {
            player.pause();
        }
    }, [isPlaying, isVideo]);

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
                {isShowMessage && isImage && (
                    <ScrollView
                        horizontal
                        style={styles.messageImagesContainer}
                    >
                        {message.messageUrl.split(',').map((url: string) => (
                            <Image
                                key={url}
                                style={styles.messageImage}
                                source={{ uri: url.trim() }}
                            />
                        ))}
                    </ScrollView>
                )}
                {isShowMessage && isVideo && (
                    <VideoView
                        style={styles.video}
                        player={player}
                        allowsFullscreen
                        allowsPictureInPicture
                    />
                )}
                {isShowMessage && isPDF && (
                    <TouchableOpacity onPress={handleOpenPDF}>
                        <View style={styles.pdfContainer}>
                            <Text style={styles.pdfText}>
                                📄 {message.messageContent ?? 'PDF File'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                {isShowMessage && message.messageType === 'sticker' && (
                    <Text style={styles.messageText}>Sticker</Text>
                )}
                {isShowMessage &&
                    message.messageContent &&
                    !isImage &&
                    !isVideo &&
                    !isPDF && (
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
