import { AxiosResponse } from 'axios';
import axiosInstance from '../configs/axiosClient';
import { User } from '../stores/groupStore';

// Định nghĩa các interface
export interface GroupResponse {
    groupName: string;
    createdAt: number;
    destroy: boolean;
    groupAvatar: string;
    updatedAt: number;
    groupID: string;
}

interface MessageResponse {
    content: string;
    conversationID: string;
    senderID: string;
    type: string;
}

// Tạo nhóm
export const createGroup = async (
    groupName: string,
    members: string[],
    avatarGroup?: File,
): Promise<AxiosResponse<GroupResponse>> => {
    const formData = new FormData();
    formData.append('groupName', groupName);
    if (avatarGroup) {
        formData.append('avatarGroup', avatarGroup);
    }
    members.forEach((member) => {
        formData.append('members', member);
    });

    return axiosInstance.post<GroupResponse>('/groups/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getGroupInfo = async (groupID: string): Promise<GroupResponse> => {
    const response = await axiosInstance.get<GroupResponse>(
        `/groups/group/${groupID}`,
    );
    return response.data;
};

export const getMembersOfGroup = async (
    groupID: string,
): Promise<
    {
        groupID: string;
        role: 'member' | 'admin';
        userInfo: User;
    }[]
> => {
    const response = await axiosInstance.get<
        {
            groupID: string;
            role: 'member' | 'admin';
            userInfo: User;
        }[]
    >(`/groups/members/${groupID}`);
    return response.data;
};

export const inviteGroup = async (
    groupID: string,
    members: string[],
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    console.log('inviteGroup', groupID);
    members.forEach((member) => {
        console.log('member', member);
    });
    return axiosInstance.post('/groups/invite', { groupID, members });
};

// Rời nhóm
export const leaveGroup = (
    groupID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/leave', { groupID });
};

// Kích thành viên khỏi nhóm
export const kickMember = (
    groupID: string,
    memberID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    console.log('kickMember', groupID, memberID);
    return axiosInstance.post('/groups/kick-member', { groupID, memberID });
};

// Giải tán nhóm
export const deleteGroup = (
    groupID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/delete', { groupID });
};

// Cấp quyền admin
export const grantAdmin = (
    participantId: string,
    groupID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/admin/grant', {
        participantId,
        groupID,
    });
};

export const grantDeputy = (
    participantId: string,
    groupID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/admin/deputy', {
        participantId,
        groupID,
    });
};

export const revokeDeputy = (
    participantId: string,
    groupID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/admin/revoke-deputy', {
        participantId,
        groupID,
    });
};

// Gửi tin nhắn văn bản
export const sendMessage = (data: {
    message: string;
    groupID: string;
}): Promise<AxiosResponse<MessageResponse>> => {
    return axiosInstance.post<MessageResponse>('/groups/messages/send', data);
};

// Gửi tin nhắn file
export const sendFiles = (
    groupID: string,
    files: File[],
): Promise<AxiosResponse<MessageResponse>> => {
    const formData = new FormData();
    formData.append('groupID', groupID);
    files.forEach((file) => {
        formData.append('files', file);
    });

    return axiosInstance.post<MessageResponse>(
        '/groups/messages/send/files',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};

// Thu hồi tin nhắn
export const revokeMessage = (
    messageID: string,
    groupID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/messages/revoke', {
        messageID,
        groupID,
    });
};

// Xóa tin nhắn
export const deleteMessage = (
    messageID: string,
    groupID: string,
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/messages/delete', {
        messageID,
        groupID,
    });
};

// Chia sẻ tin nhắn tới nhiều nhóm
export const shareMessage = (
    messageID: string,
    groupIDs: string[],
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return axiosInstance.post('/groups/messages/share', {
        messageID,
        groupIDs,
    });
};

// Lấy danh sách nhóm của người dùng
export const getMyGroups = (): Promise<AxiosResponse<GroupResponse[]>> => {
    return axiosInstance.get<GroupResponse[]>('/groups/my-groups');
};

// Lấy tất cả các nhóm
export const getAllGroups = (): Promise<AxiosResponse<GroupResponse[]>> => {
    return axiosInstance.get<GroupResponse[]>('/groups/all-groups');
};

export const sendReplyMessage = async (data: {
    message: string;
    replyMessageID: string;
    groupID: string;
}) => {
    const response = await axiosInstance.post(`/groups/messages/reply`, data);
    return response.data;
};
