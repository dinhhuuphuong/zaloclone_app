import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { getMessagesByConversation } from '../services/messageService';

interface Message {
    createdAt: string;
    // Thêm các trường khác của message nếu cần
}

interface TypeContent {
    conversation: {
        conversation: {
            conversationID: string;
        };
    };
}

const useMessageSocket = (
    socket: typeof Socket | null,
    userID: string | null,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
    useEffect(() => {
        if (!socket || !userID) return;

        const handleNewMessage = (data: unknown) => {
            console.log('New message received:', data);
            fetchAndSortMessages();
        };

        const fetchAndSortMessages = async () => {
            try {
                const conversationID = '';
                const fetchedMessages = await getMessagesByConversation(
                    conversationID,
                );
                const sortedMessages = [...fetchedMessages].sort(
                    (a: Message, b: Message) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                );
                setMessages(sortedMessages);
            } catch {
                setMessages([]);
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, userID, messages, setMessages]);
};

export default useMessageSocket;
