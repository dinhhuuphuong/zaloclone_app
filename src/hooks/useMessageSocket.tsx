import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { getMessagesByConversation } from '../services/messageService';
import useMessagesStore, { IMessage } from '../stores/messagesStore';
import useUserStore from '../stores/userStore';

const useMessageSocket = () => {
    const { setMessages } = useMessagesStore();
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;

    useEffect(() => {
        if (!socket || !userID) return;

        const handleNewMessage = (data: IMessage) => {
            console.log('New message received:', data);
            fetchAndSortMessages(data.conversationID);
        };

        const fetchAndSortMessages = async (conversationID: string) => {
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
            } catch {
                setMessages(conversationID, []);
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, userID, setMessages]);
};

export default useMessageSocket;
