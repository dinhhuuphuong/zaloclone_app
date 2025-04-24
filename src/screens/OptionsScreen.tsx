import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { deleteGroup, grantAdmin, kickMember } from '../services/groupService';
import useChatStore from '../stores/chatStore';
import useGroupStore, { User } from '../stores/groupStore';
import useUserStore from '../stores/userStore';
import { showError } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Options'>;

export default function OptionsScreen() {
    const { chat } = useChatStore();
    const { group } = useGroupStore();
    const navigation = useNavigation<NavigationProp>();
    const { user } = useUserStore();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<User | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
    const myRole = useMemo(() => {
        if (!chat?.conversationID) return null;

        return (
            group[chat.conversationID]?.find(
                (member) => member.userID === user?.userID,
            )?.role || null
        );
    }, [chat?.conversationID, group, user?.userID]);

    const members: User[] = useMemo(() => {
        if (!chat?.conversationID) return [];

        return group[chat.conversationID] || [];
    }, [chat?.conversationID, group]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleMemberOptions = useCallback(
        (member: User, event: any) => {
            // Chỉ admin mới có quyền quản lý thành viên
            if (myRole !== 'admin') return;

            // Lấy vị trí của nút để hiển thị popover
            const { pageX, pageY } = event.nativeEvent;
            setPopoverPosition({ x: pageX - 150, y: pageY - 20 });
            setSelectedMember(member);
            setPopoverVisible(true);
        },
        [myRole],
    );

    const handleSetAdmin = async () => {
        try {
            if (!selectedMember || chat?.conversationID === undefined) return;

            await grantAdmin(selectedMember?.userID, chat.conversationID);

            setPopoverVisible(false);
        } catch (error) {
            showError(error, 'Đã có lỗi xảy ra');
        }
    };

    const handleKickMember = async () => {
        try {
            if (!selectedMember || chat?.conversationID === undefined) return;

            await kickMember(chat?.conversationID, selectedMember.userID);

            setPopoverVisible(false);
        } catch (error) {
            showError(error, 'Đã có lỗi xảy ra');
        }
    };

    const closePopover = () => {
        setPopoverVisible(false);
    };

    const handleToAddMembers = () => {
        navigation.navigate('AddFriendToGroup');
    };

    const handleDeleteGroup = async () => {
        try {
            if (!chat?.conversationID) return;

            const groupID = chat.conversationID;

            await deleteGroup(groupID);

            navigation.navigate('Home');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!chat) navigation.navigate('Home');
    }, [chat]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                >
                    <Ionicons name='chevron-back' size={28} color='white' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Options</Text>
            </View>

            <ScrollView style={styles.content}>
                {(myRole === 'admin' && (
                    <>
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={handleToAddMembers}
                        >
                            <View style={styles.optionIconContainer}>
                                <MaterialIcons
                                    name='person-add-alt-1'
                                    size={22}
                                    color='#666'
                                />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>
                                    Thêm thành viên
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Leave Group */}
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={handleDeleteGroup}
                        >
                            <View style={styles.optionIconContainer}>
                                <MaterialIcons
                                    name='logout'
                                    size={22}
                                    color='#ff3b30'
                                />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.leaveGroupText}>
                                    Giải tán nhóm
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )) || (
                    <TouchableOpacity style={styles.optionItem}>
                        <View style={styles.optionIconContainer}>
                            <MaterialIcons
                                name='logout'
                                size={22}
                                color='#ff3b30'
                            />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.leaveGroupText}>Rời nhóm</Text>
                        </View>
                    </TouchableOpacity>
                )}

                <View style={styles.divider} />

                <View style={styles.membersSection}>
                    <View style={styles.membersSectionHeader}>
                        <Text style={styles.membersSectionTitle}>
                            Danh sách thành viên ({members?.length ?? 0})
                        </Text>
                    </View>

                    {/* Members List */}
                    {members.map((member) => (
                        <View
                            key={member.userID}
                            style={styles.memberContainer}
                        >
                            <View style={styles.memberItem}>
                                <View style={styles.memberAvatarContainer}>
                                    <Image
                                        source={
                                            member.avatar
                                                ? { uri: member.avatar }
                                                : require('../assets/images/225-default-avatar.png')
                                        }
                                        style={styles.memberAvatar}
                                    />
                                    {member.role === 'admin' && (
                                        <View style={styles.crownBadge}>
                                            <MaterialIcons
                                                name='stars'
                                                size={12}
                                                color='#FFD700'
                                            />
                                        </View>
                                    )}
                                </View>
                                <View style={styles.memberInfo}>
                                    <Text style={styles.memberName}>
                                        {member.userID === user?.userID
                                            ? 'Bạn'
                                            : member.fullName}
                                    </Text>
                                </View>
                            </View>
                            {myRole === 'admin' &&
                                member.userID !== user?.userID && (
                                    <TouchableOpacity
                                        style={styles.p10}
                                        onPress={(event) =>
                                            handleMemberOptions(member, event)
                                        }
                                    >
                                        <Feather
                                            name='more-vertical'
                                            size={20}
                                            color='#666'
                                        />
                                    </TouchableOpacity>
                                )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Modal
                transparent={true}
                visible={popoverVisible}
                animationType='fade'
                onRequestClose={closePopover}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closePopover}
                >
                    <View
                        style={[
                            styles.popoverContainer,
                            {
                                left: popoverPosition.x,
                                top: popoverPosition.y,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.popoverItem}
                            onPress={handleSetAdmin}
                        >
                            <MaterialIcons
                                name='stars'
                                size={20}
                                color='#0084ff'
                            />
                            <Text style={styles.popoverText}>
                                Đặt trưởng nhóm
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.popoverDivider} />

                        <TouchableOpacity
                            style={styles.popoverItem}
                            onPress={handleKickMember}
                        >
                            <MaterialIcons
                                name='person-remove'
                                size={20}
                                color='#ff3b30'
                            />
                            <Text
                                style={[
                                    styles.popoverText,
                                    { color: '#ff3b30' },
                                ]}
                            >
                                Kích thành viên
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    p10: {
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0084ff',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },
    optionIconContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: 15,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
    },
    divider: {
        height: 8,
        backgroundColor: '#f0f0f0',
    },
    leaveGroupText: {
        fontSize: 16,
        color: '#ff3b30',
    },
    memberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    membersSection: {
        backgroundColor: 'white',
    },
    membersSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    membersSectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0084ff',
    },
    memberItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    memberAvatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    memberAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    crownBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        marginBottom: 2,
    },
    memberStatus: {
        fontSize: 14,
        color: '#999',
    },
    addButton: {
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    popoverContainer: {
        position: 'absolute',
        width: 180,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    popoverItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    popoverText: {
        marginLeft: 10,
        fontSize: 14,
    },
    popoverDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
    },
});
