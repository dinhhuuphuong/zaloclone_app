import { create } from 'zustand';
import { SearchUserByPhoneNumber } from '../types/user';

export interface IConversation {
    conversation: Conversation;
    lastMessage: LastMessage;
}

export interface Conversation {
    createdAt: number;
    conversationID: string;
    destroy: boolean;
    userID: string;
    lastMessageID: string;
    updatedAt: number;
    receiver?: SearchUserByPhoneNumber;
}

export interface LastMessage {
    revoke: boolean;
    messageID: string;
    updatedAt: number;
    messageUrl?: any;
    senderID: string;
    messageType: string;
    createdAt: number;
    conversationID: string;
    messageContent: string;
    senderDelete: boolean;
}

interface ConversationsStore {
    conversations: IConversation[] | null;
    setConversations: (conversations: IConversation[]) => void;
    setReceiver: (
        conversationID: string,
        receiver: SearchUserByPhoneNumber,
    ) => void;
}

const useConversationsStore = create<ConversationsStore>((set) => ({
    conversations: null,
    setConversations: (conversations: IConversation[]) =>
        set({ conversations }),
    setReceiver: (conversationID: string, receiver: SearchUserByPhoneNumber) =>
        set((state) => ({
            conversations: state.conversations?.map((conversation) =>
                conversation.conversation.conversationID === conversationID
                    ? { ...conversation, receiver }
                    : conversation,
            ),
        })),
}));

export default useConversationsStore;
