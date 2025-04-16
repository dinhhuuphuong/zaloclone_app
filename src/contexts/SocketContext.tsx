import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import useUserStore from '../stores/userStore';

type SocketContextType = typeof Socket | null;

// Tạo context với kiểu dữ liệu
const SocketContext = createContext<SocketContextType>(null);

export const useSocket = (): SocketContextType => {
    return useContext(SocketContext);
};

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<SocketContextType>(null);
    const { user } = useUserStore();

    useEffect(() => {
        try {
            if (!user?.userID) return;

            const connectSocket = io(process.env.EXPO_PUBLIC_SOCKET_ENDPOINT, {
                query: {
                    userId: user.userID,
                },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            connectSocket.on('connect', () => {
                console.log('Connected to socket server');
            });

            setSocket(connectSocket);

            return () => {
                connectSocket.disconnect();
            };
        } catch (error) {
            console.error('Error connecting to socket server:', error);
        }
    }, [user?.userID]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
