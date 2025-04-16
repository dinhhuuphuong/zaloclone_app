import axiosInstance from '../configs/axiosClient';
import { SearchUserByPhoneNumber } from '../types/User';

// Interface cho dữ liệu người dùng
export interface IUser {
    id: string;
    phoneNumber: string;
    fullName: string;
    avatar: string;
    gender: boolean;
    dayOfBirth: string;
    createdAt: string;
    updatedAt: string;
}

// Interface cho dữ liệu quên mật khẩu
interface IForgetPassword {
    phoneNumber: string;
    newPassWord: string;
    reNewPassWord: string;
}

// Interface cho response từ API
interface IApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

/**
 * Tìm kiếm người dùng theo số điện thoại
 * @param phoneNumber Số điện thoại cần tìm kiếm
 * @returns Promise<IUser[]> Danh sách người dùng tìm thấy
 */
export const searchUserByPhoneNumber = async (
    phoneNumber: string,
): Promise<SearchUserByPhoneNumber> => {
    try {
        const response = await axiosInstance.get(
            `/users/search/${phoneNumber}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error searching user by phone number:', error);
        throw error;
    }
};

/**
 * Lấy thông tin người dùng theo ID
 * @param userId ID của người dùng
 * @returns Promise<IUser> Thông tin người dùng
 */
export const getUserById = async (userId: string): Promise<IUser> => {
    try {
        const response = await axiosInstance.get<IApiResponse<IUser>>(
            `/users/user/${userId}`,
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

/**
 * Đổi mật khẩu khi quên mật khẩu
 * @param data Dữ liệu đổi mật khẩu
 * @returns Promise<boolean> Kết quả đổi mật khẩu
 */
export const forgetPassword = async (
    data: IForgetPassword,
): Promise<boolean> => {
    try {
        const response = await axiosInstance.put<IApiResponse<null>>(
            '/users/forget-password',
            data,
        );
        return response.status === 200;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error in forget password:', error);
        throw error;
    }
};

/**
 * Kiểm tra số điện thoại có tồn tại trong hệ thống
 * @param phoneNumber Số điện thoại cần kiểm tra
 * @returns Promise<boolean> Kết quả kiểm tra
 */
export const checkPhoneNumber = async (
    phoneNumber: string,
): Promise<boolean> => {
    try {
        const response = await axiosInstance.get<IApiResponse<null>>(
            `/users/checkPhoneNumber/${phoneNumber}`,
        );
        return response.status === 200;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error checking phone number:', error);
        throw error;
    }
};

interface IUpdatePassword {
    currentPassWord: string;
    newPassWord: string;
    reNewPassWord: string;
}

export const updatePassword = async (
    data: IUpdatePassword,
): Promise<boolean> => {
    try {
        const response = await axiosInstance.put<IApiResponse<null>>(
            '/users/update-password',
            data,
        );
        return response.status === 200;
    } catch (error: any) {
        console.error('Error updating password:', error);
        throw error;
    }
};

export const updateAvatar = async (formData: FormData) => {
    try {
        const response = await axiosInstance.put<IApiResponse<null>>(
            '/users/update-avatar',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.status === 200;
    } catch (error: any) {
        console.error('Error updating avatar:', error);
        throw error;
    }
};
