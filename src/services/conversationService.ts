import axiosInstance from '../configs/axiosClient';

interface Conversation {
    id: string;
}

interface User {
    id: string;
}

export const getConversations = async (): Promise<Conversation[]> => {
    try {
        const response = await axiosInstance.get<Conversation[]>(
            '/conversations',
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
};

export const getReceiver = async (conversationID: string): Promise<User> => {
    try {
        const response = await axiosInstance.get<User>(
            `/conversations/getReceiver/${conversationID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching receiver:', error);
        throw error;
    }
};

export const haveTheyChatted = async (userID: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.get<boolean>(
            `/conversations/haveTheyChatted/${userID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error checking if they have chatted:', error);
        throw error;
    }
};
