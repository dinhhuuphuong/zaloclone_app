### Công nghệ cốt lõi

-   Framework : React Native với Expo Go
-   Ngôn ngữ : TypeScript
-   Styling : TailwindCSS (NativeWind)
-   State Management : Zustand và Recoil
-   API Client : Axios
-   Realtime Communication : Socket.io

### Cấu trúc thư mục

src/
├── assets/ # Tài nguyên tĩnh (hình ảnh, SVG)
├── components/ # Các component tái sử dụng
├── configs/ # Cấu hình (axios, API endpoints)
├── constants/ # Các hằng số ứng dụng
├── contexts/ # React Contexts
├── firebase/ # Cấu hình và dịch vụ Firebase
├── hooks/ # Custom React hooks
├── navigation/ # Cấu hình điều hướng
├── recoil/ # Quản lý state với Recoil
├── screens/ # Các màn hình ứng dụng
├── services/ # Các dịch vụ API
├── stores/ # Quản lý state với Zustand
├── types/ # Định nghĩa TypeScript
└── utils/ # Các tiện ích

### Quy tắc đặt tên

-   Files :

    -   Components: PascalCase (ví dụ: Button.tsx , UserDropDown.tsx )
    -   Hooks: camelCase với tiền tố "use" (ví dụ: useChat.tsx , useSocketOnlineStatus.tsx )
    -   Stores: camelCase với hậu tố "Store" (ví dụ: userOnlineStore.ts , friendRequestsStore.ts )
    -   Constants: camelCase với hậu tố "constants" (ví dụ: app.constants.ts )

-   Biến và hàm :

    -   Sử dụng camelCase cho biến và hàm
    -   Sử dụng PascalCase cho interfaces, types và components

### State Management

-   Sử dụng Zustand cho state management

### API và Networking

-   Sử dụng Axios cho các HTTP requests
-   Cấu hình interceptors để xử lý authentication và refresh token
-   Sử dụng Socket.io cho real-time communication

### Hooks

-   Tạo custom hooks cho các logic tái sử dụng
-   Tách biệt logic nghiệp vụ khỏi components
-   Sử dụng hooks cho việc kết nối socket và xử lý sự kiện

### TypeScript

-   Sử dụng strict mode trong tsconfig.json
-   Định nghĩa interfaces và types cho tất cả các đối tượng
-   Tránh sử dụng any type khi có thể

### Environment Variables

-   Sử dụng tiền tố EXPO*PUBLIC* cho các biến môi trường trong Expo
-   Sử dụng react-native-dotenv để quản lý biến môi trường

## Các thực hành tốt nhất

1. Tách biệt concerns : Tách logic nghiệp vụ khỏi UI components
2. Sử dụng TypeScript : Đảm bảo type safety cho toàn bộ codebase
3. Tối ưu hóa re-renders : Sử dụng memo, useCallback và useMemo khi cần thiết
4. Xử lý lỗi : Implement error handling cho tất cả các API calls và socket events
5. Responsive design : Đảm bảo UI hoạt động tốt trên nhiều kích thước màn hình
6. Code splitting : Tách code thành các modules nhỏ, dễ quản lý
7. Documentation : Viết comments và documentation cho code phức tạp
