import { create } from 'zustand';
import { IFriendRequest } from '../types/friend';

interface FriendsStore {
    friends: IFriendRequest[];
    setFriends: (friends: IFriendRequest[]) => void;
}

const useFriendsStore = create<FriendsStore>((set) => ({
    friends: [],
    setFriends: (friends: IFriendRequest[]) => set({ friends }),
}));

export default useFriendsStore;
