import { create } from 'zustand';

export interface UserOnline {
    userIds: string[];
}

interface UserOnlineStore {
    userOnline: UserOnline | null;
    setUserOnline: (userOnline: UserOnline) => void;
}

const useUserOnlineStore = create<UserOnlineStore>((set) => ({
    userOnline: null,
    setUserOnline: (userOnline: UserOnline) => set({ userOnline }),
}));

export default useUserOnlineStore;
