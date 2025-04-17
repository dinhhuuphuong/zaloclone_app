import { create } from 'zustand';

export interface Chat {
    avatar: string;
    userID: string;
    fullName: string;
    conversationID?: string;
}

interface ChatStore {
    chat: Chat | null;
    setChat: (chat: Chat) => void;
    setConversationID: (conversationID: string) => void;
}

const useChatStore = create<ChatStore>((set) => ({
    chat: null,
    setChat: (chat: Chat) => set({ chat }),
    setConversationID: (conversationID: string) =>
        set((state) => ({
            ...state,
            chat: state.chat
                ? ({
                      ...state.chat,
                      conversationID,
                  } as Chat)
                : null,
        })),
}));

export default useChatStore;
