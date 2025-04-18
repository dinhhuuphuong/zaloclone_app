import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { styled } from 'nativewind';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useChat } from '../hooks/useChat';
import useConversationSocket from '../hooks/useConversationSocket';
import useFriendRequestSocket from '../hooks/useFriendRequestSocket';
import useMessageSocket from '../hooks/useMessageSocket';
import useSocketOnlineStatus from '../hooks/useSocketOnlineStatus';
import { RootStackParamList } from '../navigation/types';
import {
    getFriendList,
    getFriendRequests,
    getSentFriendRequests,
} from '../services/apiFunctionFriend';
import { getConversations, getReceiver } from '../services/conversationService';
import useChatStore from '../stores/chatStore';
import useConversationsStore, {
    IConversation,
} from '../stores/conversationsStore';
import useFriendRequestsStore from '../stores/friendRequestsStore';
import useFriendsStore from '../stores/friendsStore';
import useSentFriendRequestsStore from '../stores/sentFriendRequestsStore';
import { SearchUserByPhoneNumber } from '../types/user';
import { parseTimestamp } from '../utils';

const StyledView = styled(View);

type NavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

const menuItems = [
    { id: '1', title: 'Thêm bạn', icon: '👤' },
    { id: '2', title: 'Tạo nhóm', icon: '👥' },
    { id: '3', title: 'Cloud của tôi', icon: '☁️' },
    { id: '4', title: 'Lịch Zalo', icon: '📅' },
    { id: '5', title: 'Tạo cuộc gọi nhóm', icon: '📞' },
    { id: '6', title: 'Thiết bị đã đăng nhập', icon: '💻' },
];

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { setChat } = useChatStore();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { setFriends } = useFriendsStore();
    const { setFriendRequests } = useFriendRequestsStore();
    const { setSentRequests } = useSentFriendRequestsStore();
    const { conversations, setConversations } = useConversationsStore();

    const handleMenuItemPress = (itemId: string) => {
        setIsMenuVisible(false);
        // Xử lý khi nhấn vào menu item
        switch (itemId) {
            case '1':
                navigation.navigate('AddFriends');
                break;
            case '2':
                // Xử lý tạo nhóm
                break;
            // ... xử lý các case khác
        }
    };

    useSocketOnlineStatus();
    useMessageSocket();
    useFriendRequestSocket();
    useConversationSocket();
    useChat();

    useEffect(() => {
        const fetchData = async () => {
            const [
                // conversations,
                friendRequests,
                sentFriendRequests,
                friendList,
            ] = await Promise.allSettled([
                // getConversations(),
                getFriendRequests(),
                getSentFriendRequests(),
                getFriendList(),
            ]);

            if (friendList.status === 'fulfilled') setFriends(friendList.value);
            else setFriends([]);
            if (friendRequests.status === 'fulfilled')
                setFriendRequests(friendRequests.value);
            else setFriendRequests([]);
            if (sentFriendRequests.status === 'fulfilled')
                setSentRequests(sentFriendRequests.value);
            else setSentRequests([]);
            // if (conversations.status === 'fulfilled') {
            //     const conversationsValue: IConversation[] = conversations.value;

            //     const response = await Promise.all(
            //         conversations.value.map(
            //             (conversation) =>
            //                 new Promise<
            //                     SearchUserByPhoneNumber & {
            //                         conversationId: string;
            //                     }
            //                 >((resolve) =>
            //                     getReceiver(
            //                         conversation.conversation.conversationID,
            //                     ).then((receiver) => {
            //                         resolve({
            //                             conversationId:
            //                                 conversation.conversation
            //                                     .conversationID,
            //                             ...receiver,
            //                         });
            //                     }),
            //                 ),
            //         ),
            //     );

            //     setConversations(
            //         conversationsValue.map((c) => ({
            //             ...c,
            //             conversation: {
            //                 ...c.conversation,
            //                 receiver: response.find(
            //                     (value) =>
            //                         value.conversationId ===
            //                         c.conversation.conversationID,
            //                 ),
            //             },
            //         })),
            //     );
            // } else setConversations([]);
        };

        fetchData();
    }, []);

    return (
        <StyledView className='flex-1 flex-row bg-gray-100'>
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TextInput
                        placeholder='Tìm kiếm'
                        style={styles.searchInput}
                    />
                    <View style={styles.headerIcons}>
                        <Text style={styles.icon}>📷</Text>
                        <TouchableOpacity
                            onPress={() => setIsMenuVisible(true)}
                        >
                            <Text style={styles.icon}>＋</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* POPUP MENU */}
                <Modal
                    visible={isMenuVisible}
                    transparent
                    animationType='fade'
                    onRequestClose={() => setIsMenuVisible(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setIsMenuVisible(false)}
                    >
                        <View style={styles.menuPositioner}>
                            <Pressable style={styles.menuContainer}>
                                {menuItems.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.menuItem}
                                        onPress={() =>
                                            handleMenuItemPress(item.id)
                                        }
                                    >
                                        <Text style={styles.menuIcon}>
                                            {item.icon}
                                        </Text>
                                        <Text style={styles.menuText}>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </Pressable>
                        </View>
                    </Pressable>
                </Modal>

                {/* TAB */}
                <View style={styles.tab}>
                    <Text style={[styles.tabItem, styles.tabActive]}>
                        Ưu tiên
                    </Text>
                    <Text style={styles.tabItem}>Khác</Text>
                </View>

                {/* DANH SÁCH TIN NHẮN */}
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.conversation.conversationID}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                if (!item.conversation.receiver) return;

                                setChat({
                                    ...item.conversation.receiver,
                                    conversationID:
                                        item.conversation.conversationID,
                                });
                                navigation.navigate('Chat');
                            }}
                        >
                            <View style={styles.messageItem}>
                                <Image
                                    source={
                                        item.conversation.receiver?.avatar
                                            ? {
                                                  uri: item.conversation
                                                      .receiver.avatar,
                                              }
                                            : require('../assets/images/225-default-avatar.png')
                                    }
                                    style={styles.avatar}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.name}>
                                        {item.conversation.receiver?.fullName}
                                    </Text>
                                    <Text style={styles.message}>
                                        {item.lastMessage.messageContent}
                                    </Text>
                                </View>
                                <Text style={styles.time}>
                                    {parseTimestamp(
                                        item.lastMessage.updatedAt ??
                                            item.lastMessage.createdAt,
                                    )}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </StyledView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        backgroundColor: '#0084ff',
        flexDirection: 'row',
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 10,
        alignItems: 'center',
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 10,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    icon: {
        fontSize: 20,
        color: '#fff',
        marginLeft: 10,
    },
    tab: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tabItem: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 10,
        color: '#888',
        fontWeight: '500',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderColor: '#0099FF',
        color: '#000',
    },
    messageItem: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    name: { fontWeight: 'bold', fontSize: 15 },
    message: { color: '#666' },
    time: { marginLeft: 6, color: '#999', fontSize: 12 },
    bottomTab: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    tabIcon: {
        fontSize: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuPositioner: {
        position: 'absolute',
        top: 60,
        right: 10,
        width: 200,
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuIcon: {
        fontSize: 18,
        marginRight: 12,
        width: 24,
    },
    menuText: {
        fontSize: 15,
        color: '#000',
        fontWeight: '400',
    },
});
