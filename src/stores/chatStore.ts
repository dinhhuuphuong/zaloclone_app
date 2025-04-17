import { create } from 'zustand';

export interface Chat {
    avatar: string;
    userID: string;
    fullName: string;
}

interface ChatStore {
    chat: Chat | null;
    setChat: (chat: Chat) => void;
}

const useChatStore = create<ChatStore>((set) => ({
    chat: null,
    setChat: (chat: Chat) => set({ chat }),
}));

export default useChatStore;
