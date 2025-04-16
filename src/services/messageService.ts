import axiosInstance from '../configs/axiosClient';

interface Message {
    createdAt: string;
    // Thêm các trường khác của message nếu cần
}

export const getMessagesByConversation = async (
    conversationID: string,
): Promise<Message[]> => {
    const response = await axiosInstance.get(
        `/messages/conversation/${conversationID}`,
    );
    return response.data;
};
