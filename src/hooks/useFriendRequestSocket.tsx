import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import {
    getFriendRequests,
    getSentFriendRequests,
} from '../services/apiFunctionFriend';

interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const useFriendRequestSocket = (
    socket: typeof Socket | null,
    userID: string | null,
) => {
    const [requestList, setRequestList] = useState<FriendRequest[]>([]);
    const fetchRequestList = async () => {
        try {
            const results = await getFriendRequests();
            console.log('🚀 ~ fetchRequestList ~ results:', results);
        } catch (error: any) {
            if (error.response?.data?.statusCode === 404) {
                setRequestList([]);
            }
        }
    };

    const [sentRequestList, setSentRequestList] = useState<FriendRequest[]>([]);
    const fetchSentRequestList = async () => {
        try {
            const results = await getSentFriendRequests();
            console.log('🚀 ~ fetchSentRequestList ~ results:', results);
        } catch (error: any) {
            if (error.response?.data?.statusCode === 404) {
                setSentRequestList([]);
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

    return { requestList, sentRequestList };
};

export default useFriendRequestSocket;
