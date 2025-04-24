import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { getConversations, getReceiver } from '../services/conversationService';
import { getGroupInfo } from '../services/groupService';
import useConversationsStore from '../stores/conversationsStore';
import useUserStore from '../stores/userStore';
import { SearchUserByPhoneNumber } from '../types/user';
import { toSearchUser } from '../utils';

const useConversationSocket = () => {
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;
    const { setConversations } = useConversationsStore();

    const fetchConversationList = async (): Promise<void> => {
        try {
            const results = await getConversations();
            console.log('results', results);

            const conversationsClone = [...results];
            const conversationsValue = [...results];

            const response = await Promise.all(
                conversationsClone.map(
                    (conversation) =>
                        new Promise<
                            SearchUserByPhoneNumber & {
                                conversationId: string;
                            }
                        >((resolve) => {
                            if (
                                conversation.conversation.conversationType ===
                                'single'
                            )
                                getReceiver(
                                    conversation.conversation.conversationID,
                                ).then((receiver) => {
                                    resolve({
                                        conversationId:
                                            conversation.conversation
                                                .conversationID,
                                        ...receiver,
                                    });
                                });
                            else
                                getGroupInfo(
                                    conversation.conversation.conversationID,
                                ).then((receiver) => {
                                    resolve({
                                        conversationId:
                                            conversation.conversation
                                                .conversationID,
                                        ...toSearchUser(receiver),
                                    });
                                });
                        }),
                ),
            );

            setConversations(
                conversationsValue.map((c) => ({
                    ...c,
                    conversation: {
                        ...c.conversation,
                        receiver: response.find(
                            (value) =>
                                value.conversationId ===
                                c.conversation.conversationID,
                        ),
                    },
                })),
            );
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        if (!socket || !userID) return;

        const handleGetConversationList = (): void => {
            console.log('notification');

            fetchConversationList();
        };
        fetchConversationList();

        console.log('on notification');
        socket.on('notification', handleGetConversationList);
        socket.on('newConversation', handleGetConversationList);

        return () => {
            console.log('off notification');
            socket.off('notification', handleGetConversationList);
            socket.off('newConversation', handleGetConversationList);
        };
    }, [socket, userID]);
};

export default useConversationSocket;
