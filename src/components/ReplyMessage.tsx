import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ReplyIcon } from '../assets/svg';
import useChatStore from '../stores/chatStore';
import useGroupStore from '../stores/groupStore';
import useMessagesStore, { IMessage } from '../stores/messagesStore';
import useUserStore from '../stores/userStore';
import Message from './Message';

interface ReplyMessageProps {
    message: IMessage;
}

const ReplyMessage = ({ message }: ReplyMessageProps) => {
    const { user } = useUserStore();
    const { chat } = useChatStore();
    const { conversations } = useMessagesStore();
    const { group } = useGroupStore();

    const messages = conversations[chat?.conversationID ?? ''] ?? [];
    const replyMessage = messages.find((m) => m.messageID === message.reply);

    const member = useMemo(() => {
        if (
            !chat ||
            !chat.conversationID ||
            !group[chat.conversationID] ||
            !replyMessage
        )
            return null;

        return group[chat.conversationID].find(
            (member) => member.userID === replyMessage.senderID,
        );
    }, [chat, message.senderID]);

    const isMe = useMemo(() => {
        return replyMessage?.senderID === user?.userID;
    }, [replyMessage, user]);

    if (!replyMessage) return null;

    return (
        <View style={styles.receivedBubble}>
            <View style={styles.leftAccent} />
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <ReplyIcon color='rgb(0, 120, 232)' />
                    <Text style={styles.nameText}>
                        {isMe ? 'Bạn' : member?.fullName}
                    </Text>
                </View>
                <Message
                    isReply
                    isOther={true}
                    message={replyMessage}
                    setReplyMessage={() => {}}
                />
            </View>
        </View>
    );
};

export default ReplyMessage;

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
        fontWeight: 600,
        color: '#000000',
        marginBottom: 2,
    },
    subtitleText: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
