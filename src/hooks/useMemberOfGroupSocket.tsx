import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { getGroupInfo, getMembersOfGroup } from '../services/groupService';
import useChatStore from '../stores/chatStore';
import useGroupStore from '../stores/groupStore';
import useUserStore from '../stores/userStore';
import { toGroupMembers } from '../utils';

interface KickData {
    conversationID: string;
    // Thêm các thuộc tính khác nếu cần
}

const useMemberOfGroupSocket = (): void => {
    const { chat } = useChatStore();
    const { setMembers } = useGroupStore();
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
    }, [socket, userID, chat?.conversationID]);
};

export default useMemberOfGroupSocket;
