export interface Conversation {
    id: string;
    participants: string[];
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
    // Thêm các trường khác nếu cần
}
