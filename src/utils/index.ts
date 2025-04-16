import { Alert } from 'react-native';

export function showError(
    error: any,
    message = 'Có lỗi xảy ra, vui lòng thử lại!',
) {
    Alert.alert('Lỗi', error.data?.message ?? error.message ?? message);
}
