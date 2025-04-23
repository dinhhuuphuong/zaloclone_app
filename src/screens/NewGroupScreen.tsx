import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDebounce from '../hooks/useDebounce';
import useFriendsStore from '../stores/friendsStore';
import { IFriendRequest } from '../types/friend';

// Define types for our data
type Contact = {
    id: string;
    name: string;
    avatar: string;
    lastSeen: string;
    selected: boolean;
};

export default function NewGroupScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const { friends } = useFriendsStore();
    const [selectedIds, setSelectIds] = useState<Array<string>>([]);

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

    const renderContact = ({ item }: { item: IFriendRequest }) => (
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
                        <Ionicons name='checkmark' size={16} color='white' />
                    )}
                </View>
            </View>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.fullName}</Text>
                <Text style={styles.lastSeen}>{item.phoneNumber}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton}>
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
                <TouchableOpacity style={styles.groupImageContainer}>
                    <View style={styles.groupImagePlaceholder}>
                        <Ionicons name='camera' size={24} color='#999' />
                    </View>
                    <TextInput
                        style={[
                            {
                                flex: 1,
                            },
                            styles.groupNamePlaceholder,
                        ]}
                        placeholder='Nhập tên nhóm...'
                    />
                </TouchableOpacity>
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
});
