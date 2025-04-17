import axiosInstance from '../configs/axiosClient';
import { IConversation } from '../stores/conversationsStore';
import { SearchUserByPhoneNumber } from '../types/user';

interface User {
    id: string;
}

export interface IHaveTheyChatted {
    convDetails: ConvDetails;
}

export interface ConvDetails {
    createdAt: number;
    conversationID: string;
    destroy: boolean;
    lastMessageID: string;
    userID: string;
    updatedAt: number;
}

export const getConversations = async (): Promise<IConversation[]> => {
    try {
        const response = await axiosInstance.get<IConversation[]>(
            '/conversations',
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
};

export const getReceiver = async (
    conversationID: string,
): Promise<SearchUserByPhoneNumber> => {
    try {
        const response = await axiosInstance.get<SearchUserByPhoneNumber>(
            `/conversations/getReceiver/${conversationID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching receiver:', error);
        throw error;
    }
};

export const haveTheyChatted = async (
    userID: string,
): Promise<IHaveTheyChatted> => {
    try {
        const response = await axiosInstance.get<IHaveTheyChatted>(
            `/conversations/haveTheyChatted/${userID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error checking if they have chatted:', error);
        throw error;
    }
};
