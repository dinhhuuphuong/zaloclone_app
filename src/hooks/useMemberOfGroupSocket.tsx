import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { getGroupInfo, getMembersOfGroup } from '../services/groupService';
import useChatStore from '../stores/chatStore';
import useUserStore from '../stores/userStore';

interface Conversation {
    conversationID: string;
    // Thêm các thuộc tính khác nếu cần
}

interface ConversationWrapper {
    conversation: Conversation;
}

interface TypeContent {
    contentName: string | null;
    conversation: ConversationWrapper | null;
}

interface Member {
    // Định nghĩa kiểu dữ liệu cho thành viên nhóm
    // Ví dụ:
    userID: string;
    username: string;
    // Thêm các thuộc tính khác nếu cần
}

interface KickData {
    conversationID: string;
    // Thêm các thuộc tính khác nếu cần
}

interface GroupInfo {
    groupName: string;
    // Thêm các thuộc tính khác nếu cần
}

const useMemberOfGroupSocket = (): void => {
    const { chat } = useChatStore();
    const socket = useSocket();
    const { user } = useUserStore();
    const userID = user?.userID;

    useEffect(() => {
        if (!socket || !userID) return;

        const fetchMembersOfGroup = async (): Promise<void> => {
            const conversationID = chat?.conversationID;
            if (!conversationID) return;
            try {
                const members = await getMembersOfGroup(conversationID);
                console.log('members', members);
                // setMembers(members.data);
            } catch (err) {
                console.error('Lỗi khi lấy members nhóm:', err);
                // setMembers([]);
            }
        };

        const handleChangeMemberOfGroup = (): void => {
            fetchMembersOfGroup();
        };

        const handleKickedFromGroup = (data: KickData): void => {
            const fetchInfoGroup = async (): Promise<void> => {
                const conversationID = data.conversationID;
                if (!conversationID) return;
                try {
                    const groupInfo = await getGroupInfo(conversationID);
                    console.log('groupInfo', groupInfo);
                    //   toast.error(`Bạn đã bị mời khỏi nhóm: ${groupInfo.data.groupName}`);
                } catch (err) {
                    console.error('Lỗi khi lấy thông tin nhóm:', err);
                }
            };
            fetchInfoGroup();
        };

        socket.on('kickedFromGroup', handleKickedFromGroup);
        socket.on('memberKicked', handleChangeMemberOfGroup);
        socket.on('newMember', handleChangeMemberOfGroup);
        socket.on('grantAdmin', handleChangeMemberOfGroup);
        socket.on('leaveMember', handleChangeMemberOfGroup);

        return () => {
            socket.off('kickedFromGroup', handleKickedFromGroup);
            socket.off('memberKicked', handleChangeMemberOfGroup);
            socket.off('newMember', handleChangeMemberOfGroup);
            socket.off('grantAdmin', handleChangeMemberOfGroup);
            socket.off('leaveMember', handleChangeMemberOfGroup);
        };
    }, [socket, userID]);
};

export default useMemberOfGroupSocket;
