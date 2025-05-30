import { differenceInHours, format } from 'date-fns';
import { Alert } from 'react-native';
import { GroupResponse } from '../services/groupService';
import { User } from '../stores/groupStore';
import { SearchUserByPhoneNumber } from '../types/user';

export function showError(
    error: any,
    message = 'Có lỗi xảy ra, vui lòng thử lại!',
) {
    Alert.alert('Lỗi', error.data?.message ?? error.message ?? message);
}

export const parseTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const hoursDiff = differenceInHours(now, date);

    if (hoursDiff >= 24) {
        return format(date, 'dd/MM/yyyy');
    } else {
        return format(date, 'hh:mm a');
    }
};

export const toSearchUser = (
    user: GroupResponse | SearchUserByPhoneNumber,
): SearchUserByPhoneNumber => {
    if ((user as SearchUserByPhoneNumber).userID)
        return user as SearchUserByPhoneNumber;

    const userGroup = user as GroupResponse;

    return {
        userID: userGroup.groupID,
        fullName: userGroup.groupName,
        phoneNumber: '',
        avatar: userGroup.groupAvatar,
        createAt: userGroup.createdAt,
        updateAt: userGroup.updatedAt,
        dayOfBirth: '',
        gender: true,
        destroy: userGroup.destroy,
        passWord: '',
        role: '',
        slug: '',
    };
};

export const toGroupMembers = (
    users: {
        groupID: string;
        role: 'member' | 'admin';
        userInfo: User;
    }[],
): Array<User> => {
    if (users.length === 0) return [];

    return users.map((item) => ({
        userID: item.userInfo.userID,
        phoneNumber: item.userInfo.phoneNumber,
        fullName: item.userInfo.fullName,
        avatar: item.userInfo.avatar,
        role: item.role,
    }));
};

const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'];

export const isImage = (type: string) => {
    return imageTypes.includes(type);
};

const videoTypes = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'];

export const isVideo = (type: string) => {
    return videoTypes.includes(type);
};

const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];

export const isAudio = (type: string) => {
    return audioTypes.includes(type);
};

const documentTypes = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'csv',
    'json',
];

export const isDocument = (type: string) => {
    return documentTypes.includes(type);
};

const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];

export const isArchive = (type: string) => {
    return archiveTypes.includes(type);
};
