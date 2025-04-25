import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useMemo, useState } from 'react';
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
import useDebounce from '../hooks/useDebounce';
import { RootStackParamList } from '../navigation/types';
import { getConversations, getReceiver } from '../services/conversationService';
import { createGroup, getGroupInfo } from '../services/groupService';
import useChatStore from '../stores/chatStore';
import useConversationsStore from '../stores/conversationsStore';
import useFriendsStore from '../stores/friendsStore';
import useGroupStore from '../stores/groupStore';
import { IFriendRequest } from '../types/friend';
import { SearchUserByPhoneNumber } from '../types/user';
import { showError, toSearchUser } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShareMessage'>;

export default function NewGroupScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const { friends } = useFriendsStore();
    const [selectedIds, setSelectIds] = useState<Array<string>>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<any>();
    const { setConversations } = useConversationsStore();
    const { setChat } = useChatStore();
    const { reset } = useGroupStore();

    const searchDebounce = useDebounce(searchQuery);

    const friendsFiltered = useMemo(
        () =>
            friends.filter(
                (friend) =>
                    friend.fullName
                        .toLowerCase()
                        .includes(searchDebounce.toLowerCase()) ||
                    friend.phoneNumber === searchDebounce,
            ),
        [friends, searchDebounce],
    );

    const selectedContacts: IFriendRequest[] = useMemo(
        () =>
            friendsFiltered.filter((friend) =>
                selectedIds.includes(friend.userID),
            ),
        [friendsFiltered, selectedIds],
    );
    const selectedCount = selectedContacts.length;

    const toggleContactSelection = (id: string) => {
        if (selectedIds.includes(id))
            setSelectIds((prev) => prev.filter((p) => p !== id));
        else setSelectIds((prev) => [...prev, id]);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                await handleChangeAvatar(result);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
        }
    };

    const handleChangeAvatar = async (result: any) => {
        const asset = result.assets[0];
        setAvatarPreview(asset.uri);

        const response = await fetch(asset.uri);
        const blob = await response.blob();

        const file = {
            uri: asset.uri,
            name: 'avatar.jpg',
            type: blob.type || 'image/jpeg',
        };

        setAvatar(file);
    };

    const renderContact = useCallback(
        ({ item }: { item: IFriendRequest }) => (
            <TouchableOpacity
                style={styles.contactItem}
                onPress={() => toggleContactSelection(item.userID)}
            >
                <View style={styles.checkboxContainer}>
                    <View
                        style={[
                            styles.checkbox,
                            selectedIds.includes(item.userID) &&
                                styles.checkboxSelected,
                        ]}
                    >
                        {selectedIds.includes(item.userID) && (
                            <Ionicons
                                name='checkmark'
                                size={16}
                                color='white'
                            />
                        )}
                    </View>
                </View>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.fullName}</Text>
                    <Text style={styles.lastSeen}>{item.phoneNumber}</Text>
                </View>
            </TouchableOpacity>
        ),
        [selectedIds],
    );

    const handleCreateGroup = async () => {
        try {
            const newGroup = await createGroup(groupName, selectedIds, avatar);

            const results = await getConversations();
            console.log('results', results);

            const conversationsClone = [...results];
            const conversationsValue = [...results];

            const response = await Promise.all(
                conversationsClone.map(
                    (conversation) =>
                        new Promise<
                            SearchUserByPhoneNumber & {
                                conversationId: string;
                            }
                        >((resolve) => {
                            if (
                                conversation.conversation.conversationType ===
                                'single'
                            )
                                getReceiver(
                                    conversation.conversation.conversationID,
                                ).then((receiver) => {
                                    resolve({
                                        conversationId:
                                            conversation.conversation
                                                .conversationID,
                                        ...receiver,
                                    });
                                });
                            else
                                getGroupInfo(
                                    conversation.conversation.conversationID,
                                ).then((receiver) => {
                                    resolve({
                                        conversationId:
                                            conversation.conversation
                                                .conversationID,
                                        ...toSearchUser(receiver),
                                    });
                                });
                        }),
                ),
            );

            const conversations = conversationsValue.map((c) => ({
                ...c,
                conversation: {
                    ...c.conversation,
                    receiver: response.find(
                        (value) =>
                            value.conversationId ===
                            c.conversation.conversationID,
                    ),
                },
            }));

            const conversation = conversations.find(
                (conversation) =>
                    conversation.conversation.conversationID ===
                    newGroup.data.conversationID,
            );

            setConversations(conversations);

            if (conversation) {
                const receiver = conversation.conversation.receiver;

                setChat({
                    avatar: receiver?.avatar || '',
                    fullName: receiver?.fullName || '',
                    userID: receiver?.userID || '',
                    conversationID: conversation.conversation.conversationID,
                });
                reset();

                navigation.navigate('Chat');
            }
        } catch (error) {
            showError(error, 'Tạo nhóm thất bại');
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
                    <Text style={styles.headerTitle}>New Group</Text>
                    <Text style={styles.selectedCount}>
                        Selected: {selectedCount}
                    </Text>
                </View>
            </View>

            {/* Group Info */}
            <View style={styles.groupInfoContainer}>
                <View style={styles.groupImageContainer}>
                    <TouchableOpacity
                        style={styles.groupImagePlaceholder}
                        onPress={pickImage}
                    >
                        {avatarPreview ? (
                            <Image
                                source={{
                                    uri: avatarPreview,
                                }}
                                style={styles.avatarPreview}
                            />
                        ) : (
                            <Ionicons name='camera' size={24} color='#999' />
                        )}
                    </TouchableOpacity>
                    <TextInput
                        value={groupName}
                        onChangeText={setGroupName}
                        style={[
                            {
                                flex: 1,
                            },
                            styles.groupNamePlaceholder,
                        ]}
                        placeholder='Nhập tên nhóm...'
                    />
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
                    placeholder='Search name or phone number'
                    placeholderTextColor='#999'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Contacts List */}
            <FlatList
                data={friendsFiltered}
                renderItem={renderContact}
                keyExtractor={(item) => item.userID}
                contentContainerStyle={styles.listContent}
            />

            {selectedCount > 0 && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.selectedContactsContainer}
                >
                    <View style={styles.selectedContactsPreview}>
                        {selectedContacts.map((contact) => (
                            <View
                                key={contact.userID}
                                style={styles.selectedContactItem}
                            >
                                <Image
                                    source={{ uri: contact.avatar }}
                                    style={styles.selectedAvatar}
                                />
                                <TouchableOpacity
                                    style={styles.removeSelectedButton}
                                    onPress={() =>
                                        toggleContactSelection(contact.userID)
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
                    {groupName && selectedIds.length && avatar && (
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={handleCreateGroup}
                        >
                            <Ionicons
                                name='arrow-forward'
                                size={24}
                                color='white'
                            />
                        </TouchableOpacity>
                    )}
                </KeyboardAvoidingView>
            )}
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
    groupInfoContainer: {
        alignItems: 'center',
        padding: 20,
    },
    groupImageContainer: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    groupImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    groupNamePlaceholder: {
        fontSize: 16,
        color: '#000',
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
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#0084ff',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#999',
    },
    activeTabText: {
        color: '#0084ff',
    },
    listContent: {
        paddingBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        marginBottom: 4,
    },
    lastSeen: {
        fontSize: 14,
        color: '#999',
    },
    selectedContactsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    selectedContactsPreview: {
        flex: 1,
        flexDirection: 'row',
    },
    selectedContactItem: {
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
    createButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0084ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPreview: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
});
