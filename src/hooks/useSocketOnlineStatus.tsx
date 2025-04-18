import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../contexts/SocketContext';
import useUserOnlineStore from '../stores/userOnlineStore';

interface UseSocketOnlineStatusProps {
    socket: typeof Socket | null;
    userID: string | null;
}

const useSocketOnlineStatus = () => {
    const { setUserOnline } = useUserOnlineStore();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleOnlineUsers = (users: string[]) => {
            setUserOnline({ userIds: users });
        };

        socket.on('getOnlineUsers', handleOnlineUsers);

        return () => {
            socket.off('getOnlineUsers', handleOnlineUsers);
        };
    }, [socket]);
};

export default useSocketOnlineStatus;
