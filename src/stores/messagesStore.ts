import { create } from 'zustand';

export interface IMessage {
    reply: string;
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
    setMessage: (conversationId: string, message: IMessage) => void;
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
    setMessage: (conversationId: string, message: IMessage) =>
        set((prev) => ({
            conversations: {
                ...prev.conversations,
                [conversationId]: [
                    message,
                    ...prev.conversations[conversationId],
                ],
            },
        })),
}));

export default useMessagesStore;
