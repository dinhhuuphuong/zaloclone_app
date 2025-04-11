import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const setupInterceptors = (
    navigate: (name: string, params?: object) => void,
): void => {
    axiosInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error: any): Promise<never> => {
            console.error('Request error:', error);
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => response,
        async (error: any): Promise<any> => {
            // Log lỗi chi tiết
            console.error('Response error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });

            const originalRequest = error.config;

            // Xử lý lỗi 422 (Unprocessable Entity)
            if (error.response?.status === 422) {
                const errorMessage =
                    error.response.data?.message || 'Dữ liệu không hợp lệ';
                return Promise.reject(new Error(errorMessage));
            }

            if (error.response?.status === 410 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = await AsyncStorage.getItem(
                        'refreshToken',
                    );

                    const response = await axios.post(
                        `${process.env.EXPO_PUBLIC_ENDPOINT}/users/refresh-token-app`,
                        { refreshToken },
                    );
                    const data = response.data;
                    await AsyncStorage.setItem('accessToken', data.accessToken);
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers[
                        'Authorization'
                    ] = `Bearer ${data.accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError: any) {
                    console.error('Refresh token failed:', refreshError);
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    navigate('Login');
                    return Promise.reject(
                        new Error('Phiên đăng nhập đã hết hạn'),
                    );
                }
            }
            return Promise.reject(error);
        },
    );
};

setupInterceptors(
    () => {}, // Hàm navigate mặc định
);

export default axiosInstance;
