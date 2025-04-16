import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import {
    getFriendRequests,
    getSentFriendRequests,
} from '../services/apiFunctionFriend';
import useFriendRequestsStore from '../stores/friendRequestsStore';
import useSentFriendRequestsStore from '../stores/sentFriendRequestsStore';
import useUserStore from '../stores/userStore';

const useFriendRequestSocket = () => {
    const { setFriendRequests } = useFriendRequestsStore();
    const { setSentRequests } = useSentFriendRequestsStore();
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;

    const fetchRequestList = async () => {
        try {
            const results = await getFriendRequests();
            setFriendRequests(results);
        } catch (error: any) {
            if (error.response?.data?.statusCode === 404) {
                setFriendRequests([]);
            }
        }
    };

    const fetchSentRequestList = async () => {
        try {
            const results = await getSentFriendRequests();
            setSentRequests(results);
        } catch (error: any) {
            if (error.response?.data?.statusCode === 404) {
                setSentRequests([]);
            }
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
