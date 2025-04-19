import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import {
    getFriendList,
    getFriendRequests,
    getSentFriendRequests,
} from '../services/apiFunctionFriend';
import useFriendRequestsStore from '../stores/friendRequestsStore';
import useFriendsStore from '../stores/friendsStore';
import useSentFriendRequestsStore from '../stores/sentFriendRequestsStore';
import useUserStore from '../stores/userStore';

const useFriendRequestSocket = () => {
    const { setFriendRequests } = useFriendRequestsStore();
    const { setSentRequests } = useSentFriendRequestsStore();
    const { setFriends } = useFriendsStore();
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;

    const fetchRequestList = async () => {
        try {
            const results = await getFriendRequests();
            setFriendRequests(results);
        } catch (error: any) {
            setFriendRequests([]);
        }
    };

    const fetchSentRequestList = async () => {
        try {
            const results = await getSentFriendRequests();
            setSentRequests(results);
        } catch (error: any) {
            setSentRequests([]);
        }
    };

    const fetchFriendList = async () => {
        try {
            const results = await getFriendList();
            setFriends(results);
        } catch (error: any) {
            setFriends([]);
        }
    };

    useEffect(() => {
        if (!socket || !userID) return;

        const handleFiendRequest = () => {
            fetchRequestList();
        };
        fetchRequestList();

        const handleSentFiendRequest = () => {
            fetchSentRequestList();
        };
        fetchSentRequestList();

        const handleFriendRequestAccepted = () => {
            fetchRequestList();
            fetchSentRequestList();
            fetchFriendList();
        };

        socket.on('friendRequest', handleFiendRequest);
        socket.on('sentFriendRequest', handleSentFiendRequest);
        socket.on('friendRequestAccepted', handleFriendRequestAccepted);

        return () => {
            socket.off('friendRequest', handleFiendRequest);
            socket.off('sentFriendRequest', handleSentFiendRequest);
            socket.off('friendRequestAccepted', handleFriendRequestAccepted);
        };
    }, [socket, userID]);
};

export default useFriendRequestSocket;
