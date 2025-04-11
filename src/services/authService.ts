import axiosInstance from '../configs/axiosClient';

interface User {
    id: string;
    phoneNumber: string;
    fullName: string;
    avatar?: string;
    gender?: string;
    dayOfBirth?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface LoginData {
    phoneNumber: string;
    passWord: string;
}

interface RegisterFormData {
    phoneNumber: string;
    fullName: string;
    passWord: string;
    avatar: File | null;
    gender: boolean | string;
    dayOfBirth: string;
}

export interface AuthResponse {
    accessToken: string;
    avatar: string;
    createAt: number;
    dayOfBirth: string;
    fullName: string;
    gender: boolean;
    phoneNumber: string;
    refreshToken: string;
    role: string;
    slug: string;
    updateAt?: any;
    userID: string;
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
};

export const register = async (
    data: RegisterFormData,
): Promise<AuthResponse> => {
    const phoneNumber = data.phoneNumber.replace('+84', '0');

    const [day, month, year] = data.dayOfBirth.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0',
    )}`;

    const formData = new FormData();
    formData.append('dayOfBirth', formattedDate);
    formData.append('phoneNumber', phoneNumber);
    formData.append('fullName', data.fullName);
    formData.append('passWord', data.passWord);
    formData.append('gender', data.gender.toString());

    if (data.avatar) {
        formData.append('avatar', data.avatar);
    }

    const response = await axiosInstance.post('/users/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const login = async (userData: LoginData): Promise<AuthResponse> => {
    console.log('🚀 ~ login ~ userData:', userData);
    const response = await axiosInstance.post('/users/login', userData);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await axiosInstance.post('/users/logout', {});
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.get('/users/refresh-token');
    return response.data;
};
