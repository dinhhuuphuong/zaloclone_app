import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMessage } from '../stores/messagesStore';

export const ReplyMessagePreview = ({
    message,
    onClose,
}: {
    message: IMessage;
    onClose: () => void;
}) => {
    const text = useMemo(() => {
        if (message.messageType === 'text') return message.messageContent;

        try {
            const content = JSON.parse(message.messageContent);

            return `${
                Array.isArray(content) && content.length > 1
                    ? `${content.length} files`
                    : '1 file'
            }`;
        } catch (error) {
            return message.messageContent;
        }
    }, [message]);

    return (
        <View style={styles.currentMessagePreview}>
            <View style={styles.currentMessageContent}>
                <Text style={styles.currentMessageName}>Đang trả lời:</Text>
                <Text style={styles.currentMessageText}>{text}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name='close' size={24} color='#666' />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    currentMessagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    currentMessageContent: {
        flex: 1,
    },
    currentMessageName: {
        fontSize: 14,
        fontWeight: '500',
    },
    currentMessageText: {
        fontSize: 14,
        color: '#666',
    },
    closeButton: {
        padding: 5,
    },
});
