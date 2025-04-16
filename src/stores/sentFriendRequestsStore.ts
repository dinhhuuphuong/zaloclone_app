import { create } from 'zustand';
import { IFriendRequest } from '../types/friend';

interface SentFriendRequestsStore {
    sentRequests: IFriendRequest[];
    setSentRequests: (sentRequests: IFriendRequest[]) => void;
}

const useSentFriendRequestsStore = create<SentFriendRequestsStore>((set) => ({
    sentRequests: [],
    setSentRequests: (sentRequests: IFriendRequest[]) => set({ sentRequests }),
}));

export default useSentFriendRequestsStore;
