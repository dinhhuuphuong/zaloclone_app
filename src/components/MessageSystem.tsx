import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IMessage } from '../stores/messagesStore';

interface MessageSystemProps {
    message: IMessage;
}

const MessageSystem = ({ message }: MessageSystemProps) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.text}>{message.messageContent}</Text>
            </View>
        </View>
    );
};

export default MessageSystem;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#fff',
        borderRadius: 99,
        maxWidth: '70%',
    },
    text: {
        fontSize: 14,
        color: '#99a1af',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
