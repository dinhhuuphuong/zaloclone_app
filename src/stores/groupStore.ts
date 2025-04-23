import { create } from 'zustand';

export interface User {
    userID: string;
    phoneNumber: string;
    fullName: string;
    avatar: string;
}

interface GroupStore {
    group: {
        [key: string]: Array<User>;
    };
    setMembers: (conversationId: string, users: User[]) => void;
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
}));

export default useGroupStore;
