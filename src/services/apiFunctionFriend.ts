import axiosInstance from '../configs/axiosClient';
import { IFriendRequest } from '../types/friend';

interface FriendResponse {
    data: any; // Bạn có thể thay thế 'any' bằng interface cụ thể cho response data
}

// Gửi lời mời kết bạn
export const sendFriendRequest = async (
    receiverId: string,
): Promise<FriendResponse> => {
    const response = await axiosInstance.post(`/friends/${receiverId}`, {});
    return response.data;
};

// Hủy lời mời kết bạn
export const cancelFriendRequest = async (
    receiverId: string,
): Promise<FriendResponse> => {
    const response = await axiosInstance.get(`/friends/${receiverId}/cancel`);
    console.log('cancelFriendRequest', response);
    return response.data;
};

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (
    senderId: string,
): Promise<FriendResponse> => {
    const response = await axiosInstance.get(`/friends/${senderId}/accept`);
    return response.data;
};

// Từ chối lời mời kết bạn
export const declineFriendRequest = async (
    senderId: string,
): Promise<FriendResponse> => {
    const response = await axiosInstance.get(`/friends/${senderId}/decline`);
    return response.data;
};

// Lấy danh sách lời mời kết bạn
export const getFriendRequests = async (): Promise<IFriendRequest[]> => {
    const response = await axiosInstance.get(`/friends/requests`, {});
    console.log('response', response);
    return response.data;
};

// Lấy danh sách lời mời kết bạn đã gửi
export const getSentFriendRequests = async (): Promise<IFriendRequest[]> => {
    const response = await axiosInstance.get(`/friends/requests/sent`, {});
    return response.data;
};

// Lấy danh sách bạn bè
export const getFriendList = async (): Promise<IFriendRequest[]> => {
    const response = await axiosInstance.get(`/friends`, {});
    return response.data;
};
