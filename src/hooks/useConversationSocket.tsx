import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getConversations } from '../services/conversationService';
import { Conversation } from '../types/conversation';

interface UseConversationSocketProps {
    socket: typeof Socket | null;
    userID: string | null;
}

const useConversationSocket = ({
    socket,
    userID,
}: UseConversationSocketProps): Conversation[] => {
    const [conversationList, setConversationList] = useState<Conversation[]>(
        [],
    );

    const fetchConversationList = async (): Promise<void> => {
        try {
            const results = await getConversations();

            console.log('results', results);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversationList([]);
        }
    };

    useEffect(() => {
        if (!socket || !userID) return;

        const handleGetConversationList = (): void => {
            fetchConversationList();
        };
        fetchConversationList();

        socket.on('notification', handleGetConversationList);

        return () => {
            socket.off('notification', handleGetConversationList);
        };
    }, [socket, userID]);

    return conversationList;
};

export default useConversationSocket;
