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
