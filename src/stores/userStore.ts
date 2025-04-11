import { create } from 'zustand';

export interface User {
    avatar: string;
    createAt: number;
    dayOfBirth: string;
    fullName: string;
    gender: boolean;
    phoneNumber: string;
    role: string;
    slug: string;
    updateAt?: any;
    userID: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
}));

export default useUserStore;
