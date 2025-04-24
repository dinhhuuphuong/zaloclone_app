import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useSocket } from '../contexts/SocketContext';
import { getGroupInfo, getMembersOfGroup } from '../services/groupService';
import useChatStore from '../stores/chatStore';
import useConversationsStore from '../stores/conversationsStore';
import useGroupStore from '../stores/groupStore';
import useUserStore from '../stores/userStore';
import { toGroupMembers } from '../utils';

interface KickData {
    conversationID: string;
    // Thêm các thuộc tính khác nếu cần
}

const useMemberOfGroupSocket = (): void => {
    const { chat, clearChat } = useChatStore();
    const { setMembers } = useGroupStore();
    const { deleteConversation } = useConversationsStore();
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

                setMembers(conversationID, toGroupMembers(members));
            } catch (err) {
                setMembers(conversationID, []);
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

                    Alert.alert(
                        `Bạn đã bị mời khỏi nhóm: ${groupInfo.groupName}`,
                    );
                    deleteConversation(conversationID);
                    clearChat();
                } catch (err) {
                    console.error('Lỗi khi lấy thông tin nhóm:', err);
                }
            };
            fetchInfoGroup();
        };

        const handleGroupDeleted = (conversationID: string): void => {
            deleteConversation(conversationID);
            clearChat();
        };

        socket.on('kickedFromGroup', handleKickedFromGroup);
        socket.on('memberKicked', handleChangeMemberOfGroup);
        socket.on('newMember', handleChangeMemberOfGroup);
        socket.on('grantAdmin', handleChangeMemberOfGroup);
        socket.on('leaveMember', handleChangeMemberOfGroup);
        socket.on('groupDeleted', handleGroupDeleted);

        return () => {
            socket.off('kickedFromGroup', handleKickedFromGroup);
            socket.off('memberKicked', handleChangeMemberOfGroup);
            socket.off('newMember', handleChangeMemberOfGroup);
            socket.off('grantAdmin', handleChangeMemberOfGroup);
            socket.off('leaveMember', handleChangeMemberOfGroup);
            socket.off('groupDeleted', handleGroupDeleted);
        };
    }, [socket, userID, chat?.conversationID, clearChat, deleteConversation]);
};

export default useMemberOfGroupSocket;
