import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../contexts/SocketContext';

type MessageCallback = (data: { message: string; roomId: string }) => void;
type UserCallback = (userId: string) => void;

export const useChat = () => {
    const socket = useSocket() as typeof Socket;

    const sendMessage = useCallback(
        (message: string, roomId: string) => {
            if (socket) {
                socket.emit('send_message', { message, roomId });
            }
        },
        [socket],
    );

    const joinRoom = useCallback(
        (roomId: string) => {
            if (socket) {
                socket.emit('join_room', roomId);
            }
        },
        [socket],
    );

    const leaveRoom = useCallback(
        (roomId: string) => {
            if (socket) {
                socket.emit('leave_room', roomId);
            }
        },
        [socket],
    );

    const onMessageReceived = useCallback(
        (callback: MessageCallback) => {
            if (socket) {
                socket.on('receive_message', callback);
            }
        },
        [socket],
    );

    const onUserJoined = useCallback(
        (callback: UserCallback) => {
            if (socket) {
                socket.on('user_joined', callback);
            }
        },
        [socket],
    );

    const onUserLeft = useCallback(
        (callback: UserCallback) => {
            if (socket) {
                socket.on('user_left', callback);
            }
        },
        [socket],
    );

    return {
        sendMessage,
        joinRoom,
        leaveRoom,
        onMessageReceived,
        onUserJoined,
        onUserLeft,
    };
};
