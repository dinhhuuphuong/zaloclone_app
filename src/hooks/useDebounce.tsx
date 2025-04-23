import { useState, useEffect } from 'react';

/**
 * Hook để debounce một giá trị
 * @param value Giá trị cần debounce
 * @param delay Thời gian trì hoãn tính bằng milliseconds (mặc định: 500ms)
 * @returns Giá trị đã được debounce
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Tạo một timeout để cập nhật giá trị debounced sau khoảng thời gian delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function để clear timeout nếu value hoặc delay thay đổi
    // hoặc component unmount trước khi timeout kết thúc
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;