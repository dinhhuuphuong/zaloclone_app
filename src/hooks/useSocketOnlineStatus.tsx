import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../contexts/SocketContext';
import useUserOnlineStore from '../stores/userOnlineStore';
import useUserStore from '../stores/userStore';

interface UseSocketOnlineStatusProps {
    socket: typeof Socket | null;
    userID: string | null;
}

const useSocketOnlineStatus = () => {
    const { setUserOnline } = useUserOnlineStore();
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;

    useEffect(() => {
        if (!socket || !userID) return;

        const handleOnlineUsers = (users: string[]) => {
            setUserOnline({ userIds: users });
        };

        socket.on('getOnlineUsers', handleOnlineUsers);

        return () => {
            socket.off('getOnlineUsers', handleOnlineUsers);
        };
    }, [socket, userID]);
};

export default useSocketOnlineStatus;
