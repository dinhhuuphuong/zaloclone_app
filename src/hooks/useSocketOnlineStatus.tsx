import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface UseSocketOnlineStatusProps {
    socket: typeof Socket | null;
    userID: string | null;
}

const useSocketOnlineStatus = ({
    socket,
    userID,
}: UseSocketOnlineStatusProps): boolean => {
    const [onlineStatus, setOnlineStatus] = useState<boolean>(false);

    useEffect(() => {
        if (!socket || !userID) return;

        const handleOnlineUsers = (users: string[]) => {
            console.log('Online users:', users);
            console.log('🚀 ~ handleOnlineUsers ~ users:', users);
            setOnlineStatus(users.includes(userID));
        };

        socket.on('getOnlineUsers', handleOnlineUsers);

        return () => {
            socket.off('getOnlineUsers', handleOnlineUsers);
        };
    }, [socket, userID]);

    return onlineStatus;
};

export default useSocketOnlineStatus;
