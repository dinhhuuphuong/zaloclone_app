import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { IMessage } from '../stores/messagesStore';
import { parseTimestamp } from '../utils';

const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const videoTypes = ['mp4', 'webm', 'mov'];

const Message = ({ isMe, message }: { isMe: boolean; message: IMessage }) => {
    const isImage = imageTypes.includes(message.messageType?.toLowerCase());
    const isVideo = videoTypes.includes(message.messageType?.toLowerCase());
    const isPDF = message.messageType?.toLowerCase() === 'pdf';
    const player = useVideoPlayer(message.messageUrl, (player) => {
        player.loop = true;
        player.play();
    });

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
                isMe ? styles.userMessageRow : styles.contactMessageRow,
            ]}
        >
            <View
                style={[
                    styles.messageContainer,
                    isMe ? styles.userMessage : styles.contactMessage,
                ]}
            >
                {isImage && (
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
                {isVideo && (
                    <VideoView
                        style={styles.video}
                        player={player}
                        allowsFullscreen
                        allowsPictureInPicture
                    />
                )}
                {isPDF && (
                    <TouchableOpacity onPress={handleOpenPDF}>
                        <View style={styles.pdfContainer}>
                            <Text style={styles.pdfText}>
                                📄 {message.messageContent || 'PDF File'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                {message.messageType === 'sticker' && (
                    <Text style={styles.messageText}>Sticker</Text>
                )}
                {message.messageContent && !isImage && !isVideo && !isPDF && (
                    <Text style={styles.messageText}>
                        {message.messageContent}
                    </Text>
                )}
                <Text style={styles.timeText}>
                    {parseTimestamp(message.createdAt)}
                </Text>
            </View>
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
});
