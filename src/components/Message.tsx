import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IMessage } from '../stores/messagesStore';
import { parseTimestamp } from '../utils';

const Message = ({ isMe, message }: { isMe: boolean; message: IMessage }) => {
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
                {message.messageUrl && (
                    <ScrollView
                        horizontal
                        style={styles.messageImagesContainer}
                    >
                        {message.messageUrl
                            .split(',')
                            .map((url: string, index: number) => (
                                <Image
                                    key={index}
                                    style={styles.messageImage}
                                    source={{ uri: url.trim() }}
                                />
                            ))}
                    </ScrollView>
                )}
                {message.messageType === 'sticker' && (
                    <Text style={styles.messageText}>Sticker</Text>
                )}
                {message.messageType === 'text' && !message.messageUrl && (
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
});
