import { create } from 'zustand';

export interface IMessage {
    messageID: string;
    conversationID: any;
    senderID: any;
    messageContent: any;
    messageUrl: any;
    messageType: any;
    revoke: boolean;
    senderDelete: boolean;
    createdAt: number;
    updatedAt: number;
}

interface MessagesStore {
    conversations: {
        [key: string]: IMessage[];
    };
    setMessages: (conversationId: string, messages: IMessage[]) => void;
}

const useMessagesStore = create<MessagesStore>((set) => ({
    conversations: {},
    setMessages: (conversationId: string, messages: IMessage[]) =>
        set((prev) => ({
            conversations: {
                ...prev.conversations,
                [conversationId]: messages,
            },
        })),
}));

export default useMessagesStore;
