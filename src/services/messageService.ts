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
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    return response.data;
};

export const revokeMessage = async (
    participantId: string,
    messageID: string,
    conversationID: string,
) => {
    const response = await axiosInstance.post(
        `/messages/revoke/${participantId}`,
        {
            messageID,
            conversationID,
        },
    );
    return response.data;
};

export const deleteMessage = async (
    messageID: string,
    conversationID: string,
) => {
    const response = await axiosInstance.post('/messages/delete', {
        messageID,
        conversationID,
    });
    return response.data;
};

export const shareMessage = async (
    messageID: string,
    receiverIds: string[],
    conversationID: string,
) => {
    const response = await axiosInstance.post('/messages/share', {
        messageID,
        receiverIds,
        conversationID,
    });
    return response.data;
};

export const sendReplyMessage = async ({
    receiverId,
    message,
    replyMessageID,
    conversationID,
}: {
    receiverId: string;
    message: string;
    replyMessageID: string;
    conversationID: string;
}) => {
    const response = await axiosInstance.post(
        `/messages/send/reply/${receiverId}`,
        {
            message,
            replyMessageID,
            conversationID,
        },
    );
    return response.data;
};
