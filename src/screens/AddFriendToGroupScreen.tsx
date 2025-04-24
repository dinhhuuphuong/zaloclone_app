import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Image,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { inviteGroup } from '../services/groupService';
import useChatStore from '../stores/chatStore';
import useFriendsStore from '../stores/friendsStore';
import useGroupStore from '../stores/groupStore';
import { IFriendRequest } from '../types/friend';
import { showError } from '../utils';

type NavigationProp = StackNavigationProp<
    RootStackParamList,
    'AddFriendToGroup'
>;

type Section = {
    title: string;
    data: IFriendRequest[];
};

const renderSectionHeader = ({ section }: { section: Section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
);

export default function AddFriendToGroupScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { chat } = useChatStore();
    const [searchQuery, setSearchQuery] = useState('');
    const { friends: friendsPreprocess } = useFriendsStore();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { group } = useGroupStore();

    const friends = useMemo(() => {
        if (!chat?.conversationID || !group[chat?.conversationID]) return [];

        const members = group[chat?.conversationID] || [];
        const memberIds = members.map((member) => member.userID);

        const filteredFriends = friendsPreprocess.filter(
            (friend) => !memberIds.includes(friend.userID),
        );

        return filteredFriends;
    }, [friendsPreprocess, group, chat?.conversationID]);

    const { sections } = useMemo(() => {
        const groupedContacts: { [key: string]: IFriendRequest[] } = {};
        friends.forEach((friend) => {
            const firstLetter = friend.fullName.charAt(0).toUpperCase();
            if (!groupedContacts[firstLetter]) {
                groupedContacts[firstLetter] = [];
            }
            groupedContacts[firstLetter].push(friend);
        });

        const sections: Section[] = Object.keys(groupedContacts)
            .sort()
            .map((letter) => ({
                title: letter,
                data: groupedContacts[letter],
            }));

        return {
            sections,
        };
    }, [friends]);

    const selectedContacts = friends.filter((contact) =>
        selectedIds.includes(contact.userID),
    );
    const selectedCount = selectedContacts.length;

    const handleBack = () => {
        navigation.goBack();
    };

    const toggleContactSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(
                selectedIds.filter((selectedId) => selectedId !== id),
            );
        } else {
            if (selectedIds.length >= 100) return;

            setSelectedIds([...selectedIds, id]);
        }
    };

    const removeSelectedContact = (id: string) => {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    };

    const renderContact = ({ item }: { item: IFriendRequest }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => toggleContactSelection(item.userID)}
        >
            <TouchableOpacity
                style={[
                    styles.checkbox,
                    selectedIds.includes(item.userID) &&
                        styles.checkboxSelected,
                ]}
                onPress={() => toggleContactSelection(item.userID)}
            >
                {selectedIds.includes(item.userID) && (
                    <Ionicons name='checkmark' size={20} color='white' />
                )}
            </TouchableOpacity>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.fullName}</Text>
                {item.phoneNumber && (
                    <Text style={styles.username}>{item.phoneNumber}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const handleInvite = async () => {
        try {
            if (!chat?.conversationID) return;

            await inviteGroup(chat?.conversationID, selectedIds);

            Alert.alert('Đã mời thành công');
            navigation.goBack();
            setSelectedIds([]);
        } catch (error) {
            showError(error, 'Mời thành viên vào nhóm thất bại');
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
                    style={styles.closeButton}
                    onPress={handleBack}
                >
                    <Ionicons name='close' size={24} color='black' />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Add friend to group</Text>
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
                    placeholder='Search name or phone number'
                    placeholderTextColor='#999'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={styles.keyboardIndicator}>
                    <Text style={styles.keyboardIndicatorText}>123</Text>
                </View>
            </View>

            {/* Suggestions */}
            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Danh sách bạn bè</Text>
            </View>

            {/* Contacts List */}
            <View style={styles.listContainer}>
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.userID}
                    renderItem={renderContact}
                    renderSectionHeader={renderSectionHeader}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Selected Contacts Bar */}
            {selectedCount > 0 && (
                <View style={styles.selectedContactsBar}>
                    <View style={styles.selectedContactsContainer}>
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

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleInvite}
                    >
                        <Ionicons
                            name='arrow-forward'
                            size={24}
                            color='white'
                        />
                    </TouchableOpacity>
                </View>
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
    keyboardIndicator: {
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    keyboardIndicatorText: {
        fontSize: 12,
        color: '#666',
    },
    suggestionsContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    suggestionsTitle: {
        fontSize: 16,
        color: '#666',
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
        backgroundColor: '#f9f9f9',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
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
    },
    username: {
        fontSize: 14,
        color: '#999',
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
    selectedContactsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    selectedContactsContainer: {
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
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0084ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    toggleText: {
        fontSize: 14,
        color: '#333',
    },
});
