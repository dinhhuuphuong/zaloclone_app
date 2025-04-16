import { create } from 'zustand';
import { IFriendRequest } from '../types/friend';

interface FriendRequestsStore {
    friendRequests: IFriendRequest[];
    setFriendRequests: (friendRequests: IFriendRequest[]) => void;
}

const useFriendRequestsStore = create<FriendRequestsStore>((set) => ({
    friendRequests: [],
    setFriendRequests: (friendRequests: IFriendRequest[]) =>
        set({ friendRequests }),
}));

export default useFriendRequestsStore;
