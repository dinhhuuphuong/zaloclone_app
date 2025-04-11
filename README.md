# Zalo Clone App

Ứng dụng React Native sử dụng TypeScript và TailwindCSS (NativeWind).

## Cài đặt

```bash
# Cài đặt các gói phụ thuộc
npm install

# Nếu gặp vấn đề với TailwindCSS
npm install nativewind@2.0.11 --save-dev
```

## Chạy ứng dụng

```bash
# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên web
npm run web
```

## Cấu trúc dự án

```
zalo-clone/
│
├── components/          # Các component tái sử dụng
│   └── Button.tsx       # Component nút bấm
│
├── screens/             # Các màn hình của ứng dụng
│   └── HomeScreen.tsx   # Màn hình chính
│
├── App.tsx              # Component gốc
├── babel.config.js      # Cấu hình Babel
├── tailwind.config.js   # Cấu hình TailwindCSS
└── package.json         # Cấu hình dự án
```

## Chức năng

-   Tích hợp TailwindCSS với React Native
-   Sử dụng TypeScript cho type-safety
-   Giao diện người dùng đơn giản
