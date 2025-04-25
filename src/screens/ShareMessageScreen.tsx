import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { shareMessage as shareMessageGroup } from '../services/groupService';
import { shareMessage } from '../services/messageService';
import useConversationsStore, {
    IConversation,
} from '../stores/conversationsStore';
import useFriendsStore from '../stores/friendsStore';
import { IUserBase } from '../types/user';
import { showError } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShareMessage'>;
type RouteProps = RouteProp<RootStackParamList, 'ShareMessage'>;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

type IShareItem = IUserBase & {
    type: 'group' | 'single';
};

const toShareItem = (item: IUserBase): IShareItem => ({
    ...item,
    type: 'single',
});

const toShareItems = (items: IUserBase[]): IShareItem[] =>
    items.map(toShareItem);

const toShareGroupItem = (item: IConversation): IShareItem => {
    const receiver = item.conversation.receiver;

    return {
        avatar: receiver?.avatar || '',
        fullName: receiver?.fullName || '',
        userID: item.conversation.conversationID,
        type: 'group',
    };
};

const toShareGroupItems = (items: IConversation[]): IShareItem[] =>
    items.map(toShareGroupItem);

const Item = ({
    isSelected,
    item,
    toggleContactSelection,
}: {
    isSelected: boolean;
    item: IShareItem;
    toggleContactSelection: (id: string) => void;
}) => (
    <TouchableOpacity
        style={styles.contactItem}
        onPress={() => toggleContactSelection(item.userID)}
    >
        <View style={styles.checkboxContainer}>
            <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            >
                {isSelected && (
                    <Ionicons name='checkmark' size={16} color='white' />
                )}
            </View>
        </View>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View>
            <Text style={styles.contactName}>{item.fullName}</Text>
            <Text style={styles.contactType}>
                {item.type === 'group' ? 'Nhóm' : 'Bạn bè'}
            </Text>
        </View>
    </TouchableOpacity>
);

export default function ShareMessage() {
    const route = useRoute<RouteProps>();
    const messageData = route.params;

    const navigation = useNavigation<NavigationProp>();
    const [message, setMessage] = useState(messageData.messageContent);
    const [searchQuery, setSearchQuery] = useState('');
    const { friends: friendList } = useFriendsStore();
    const { conversations } = useConversationsStore();
    const [usersSelected, setUsersSelected] = useState<Array<string>>([]);

    const conversationsGroup = useMemo(() => {
        return conversations?.filter(
            (conversation) =>
                conversation.conversation.conversationType === 'group',
        );
    }, [conversations]);

    const friends = useMemo(() => {
        return [
            ...toShareGroupItems(conversationsGroup ?? []),
            ...toShareItems(friendList),
        ];
    }, [friendList, conversationsGroup]);

    const { selectedContacts, selectedCount } = useMemo(() => {
        const selectedContacts = friends.filter((contact) =>
            usersSelected.includes(contact.userID),
        );
        const selectedCount = selectedContacts.length;

        return { selectedContacts, selectedCount };
    }, [friends, usersSelected]);

    const toggleContactSelection = (id: string) => {
        if (usersSelected.includes(id))
            setUsersSelected(usersSelected.filter((item) => item !== id));
        else setUsersSelected((prev) => [id, ...prev]);
    };

    const removeSelectedContact = (id: string) => {
        setUsersSelected(usersSelected.filter((item) => item !== id));
    };

    const handleBack = () => navigation.goBack();

    const handleShare = async () => {
        const { groupIds, userIds } = usersSelected.reduce(
            (prev, item) => {
                const share = friends.find((friend) => friend.userID === item);

                if (!share) return prev;

                const userIds = prev.userIds;
                const groupIds = prev.groupIds;

                if (share?.type === 'single') {
                    userIds.push(share.userID);
                } else {
                    groupIds.push(share.userID);
                }

                return {
                    userIds,
                    groupIds,
                };
            },
            {
                userIds: [],
                groupIds: [],
            } as {
                userIds: string[];
                groupIds: string[];
            },
        );

        try {
            // const queries = [];

            // if (userIds.length > 0) {
            //     queries.push(
            //         shareMessage(
            //             messageData.messageID,
            //             usersSelected,
            //             messageData.conversationID,
            //         ),
            //     );
            // }

            // if (groupIds.length > 0) {
            //     queries.push(shareMessageGroup(message.messageID, groupIds));
            // }

            // if (queries.length) await Promise.all(queries);

            await shareMessageGroup({
                conversationID: messageData.conversationID,
                groupIDs: groupIds,
                messageID: messageData.messageID,
                receiverIds: userIds,
            });

            navigation.goBack();
            Alert.alert('Thành công', 'Chia sẻ tin nhắn thành công');
        } catch (error) {
            showError(error, 'Có lỗi xảy ra khi chia sẻ tin nhắn');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleBack}
                >
                    <Ionicons name='close' size={24} color='black' />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Share</Text>
                    <Text style={styles.selectedCount}>
                        Selected: {selectedCount}
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons
                    name='search'
                    size={20}
                    color='#999'
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder='Search'
                    placeholderTextColor='#999'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Contacts List */}
            <View style={styles.listContainer}>
                <FlatList
                    data={friends}
                    renderItem={(item) => (
                        <Item
                            item={item.item}
                            isSelected={usersSelected.includes(
                                item.item.userID,
                            )}
                            toggleContactSelection={toggleContactSelection}
                        />
                    )}
                    keyExtractor={(item) => item.userID}
                    contentContainerStyle={styles.listContent}
                />

                {/* Alphabet Index */}
                <View style={styles.alphabetIndex}>
                    {ALPHABET.map((letter) => (
                        <TouchableOpacity key={letter} style={styles.indexItem}>
                            <Text style={styles.indexText}>{letter}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Bottom Message Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.bottomContainer}
            >
                {selectedCount > 0 && (
                    <View style={styles.selectedPreview}>
                        {selectedContacts.map((contact) => (
                            <View
                                key={contact.userID}
                                style={styles.selectedContact}
                            >
                                <Image
                                    source={
                                        contact.avatar
                                            ? { uri: contact.avatar }
                                            : require('../assets/images/225-default-avatar.png')
                                    }
                                    style={styles.avatar}
                                />
                                <TouchableOpacity
                                    style={styles.removeSelectedButton}
                                    onPress={() =>
                                        removeSelectedContact(contact.userID)
                                    }
                                >
                                    <Ionicons
                                        name='close'
                                        size={16}
                                        color='#666'
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.messageInputContainer}>
                    <TextInput
                        style={styles.messageInput}
                        placeholder='Enter message'
                        placeholderTextColor='#999'
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleShare}
                    >
                        <Ionicons name='paper-plane' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    closeButton: {
        padding: 5,
        marginRight: 15,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    selectedCount: {
        fontSize: 14,
        color: '#666',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        margin: 15,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
    },
    listContainer: {
        flex: 1,
        position: 'relative',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '500',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    listContent: {
        paddingBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    checkboxContainer: {
        marginRight: 15,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#0084ff',
        borderColor: '#0084ff',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    contactName: {
        fontSize: 16,
    },
    contactType: {
        fontSize: 14,
        color: '#666',
    },
    alphabetIndex: {
        position: 'absolute',
        right: 5,
        top: 20,
        bottom: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    indexItem: {
        padding: 2,
    },
    indexText: {
        fontSize: 12,
        color: '#666',
    },
    bottomContainer: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    selectedPreview: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    selectedContact: {
        position: 'relative',
        marginRight: 10,
    },
    selectedAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    removeSelectedButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    messagePreview: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    messagePreviewText: {
        fontSize: 14,
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    messageInput: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 10,
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0084ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
