import { differenceInHours, format } from 'date-fns';
import { Alert } from 'react-native';

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
