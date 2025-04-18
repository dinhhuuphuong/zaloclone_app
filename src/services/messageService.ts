import axiosInstance from '../configs/axiosClient';
import { IMessage } from '../stores/messagesStore';

export const getMessagesByConversation = async (
    conversationID: string,
): Promise<IMessage[]> => {
    const response = await axiosInstance.get(
        `/messages/conversation/${conversationID}`,
    );
    return response.data;
};

export const sendTextMessage = async (receiverId: string, message: string) => {
    const response = await axiosInstance.post(`/messages/send/${receiverId}`, {
        message,
    });
    return response.data;
};

export const sendFiles = async (receiverId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const response = await axiosInstance.post(
        `/messages/send/files/${receiverId}`,
        formData,
    );

    return response.data;
};
