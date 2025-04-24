import { create } from 'zustand';

export interface User {
    userID: string;
    phoneNumber: string;
    fullName: string;
    avatar: string;
    role: 'member' | 'admin';
}

interface GroupStore {
    group: {
        [key: string]: Array<User>;
    };
    setMembers: (conversationId: string, users: User[]) => void;
    reset: () => void;
}

const useGroupStore = create<GroupStore>((set) => ({
    group: {},
    setMembers: (conversationId: string, users: User[]) =>
        set((state) => ({
            group: {
                ...state.group,
                [conversationId]: users,
            },
        })),
    reset: () => set({ group: {} }),
}));

export default useGroupStore;
