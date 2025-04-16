import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { getConversations } from '../services/conversationService';
import useUserStore from '../stores/userStore';
import { Conversation } from '../types/conversation';

const useConversationSocket = () => {
    const [conversationList, setConversationList] = useState<Conversation[]>(
        [],
    );
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;

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
