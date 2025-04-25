import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { getConversations, getReceiver } from '../services/conversationService';
import { getGroupInfo } from '../services/groupService';
import { getMessagesByConversation } from '../services/messageService';
import useConversationsStore from '../stores/conversationsStore';
import useMessagesStore, { IMessage } from '../stores/messagesStore';
import useUserStore from '../stores/userStore';
import { toSearchUser } from '../utils';

const useMessageSocket = () => {
    const { setMessages } = useMessagesStore();
    const { conversations, addConversation } = useConversationsStore();
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;

    useEffect(() => {
        if (!socket || !userID) return;

        const handleNewMessage = (data: IMessage) => {
            console.log('New message received:', data);
            fetchAndSortMessages(
                Array.isArray(data)
                    ? data[0].conversationID
                    : data.conversationID,
            );
        };

        const fetchAndSortMessages = async (conversationID: string) => {
            if (!conversationID) return;

            try {
                const fetchedMessages = await getMessagesByConversation(
                    conversationID,
                );
                const sortedMessages = [...fetchedMessages].sort(
                    (a: IMessage, b: IMessage) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                );
                setMessages(conversationID, sortedMessages);

                const conversationRes = (conversations ?? []).find(
                    (conversation) =>
                        conversation.conversation.conversationID ===
                        conversationID,
                );

                if (!conversationRes) {
                    const [results, user] = await Promise.all([
                        getConversations(),
                        conversationRes!.conversation.conversationType ===
                        'single'
                            ? getReceiver(conversationID)
                            : getGroupInfo(conversationID),
                    ]);
                    const conversation = results.find(
                        (conversation) =>
                            conversation.conversation.conversationID ===
                            conversationID,
                    );

                    if (!conversation) return;

                    addConversation({
                        conversation: {
                            ...conversation.conversation,
                            receiver: toSearchUser(user),
                        },
                        lastMessage: sortedMessages[sortedMessages.length - 1],
                    });
                }
            } catch {
                setMessages(conversationID, []);
            }
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('newMessageGroup', handleNewMessage);
        socket.on('revokeMessage', handleNewMessage);
        socket.on('revokeMessageGroup', handleNewMessage);
        socket.on('deleteMessage', handleNewMessage);
        socket.on('deleteMessageGroup', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('newMessageGroup', handleNewMessage);
            socket.off('revokeMessage', handleNewMessage);
            socket.off('revokeMessageGroup', handleNewMessage);
            socket.off('deleteMessage', handleNewMessage);
            socket.off('deleteMessageGroup', handleNewMessage);
        };
    }, [socket, userID, setMessages, conversations, addConversation]);
};

export default useMessageSocket;
