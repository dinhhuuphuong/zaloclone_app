import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import useChatStore from '../../stores/chatStore';
import useFriendRequestsStore from '../../stores/friendRequestsStore';
import useFriendsStore from '../../stores/friendsStore';
import useSentFriendRequestsStore from '../../stores/sentFriendRequestsStore';
import { IFriendRequest } from '../../types/friend';

type Section = {
    id: string;
    title: string;
    icon: React.ReactNode;
    subtitle?: string;
    badge?: string;
    onPress?: () => void;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type NavigationProp = StackNavigationProp<RootStackParamList, 'FriendRequests'>;

const FriendTab = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const navigation = useNavigation<NavigationProp>();
    const { friends } = useFriendsStore();
    const { friendRequests } = useFriendRequestsStore();
    const { sentRequests } = useSentFriendRequestsStore();
    const { setChat } = useChatStore();

    const handleToChatScreen = (user: IFriendRequest) => {
        setChat(user);
        navigation.navigate('Chat');
    };

    const handleNavigateToFriendRequests = () => {
        navigation.navigate('FriendRequests');
    };

    // Sample data
    const sections: Section[] = [
        {
            id: '1',
            title: 'Friend requests',
            icon: (
                <View style={styles.iconContainer}>
                    <Ionicons name='people' size={24} color='white' />
                </View>
            ),
            badge: (friendRequests.length + sentRequests.length).toString(),
            onPress: handleNavigateToFriendRequests,
        },
        {
            id: '2',
            title: 'Phonebook',
            icon: (
                <View style={styles.iconContainer}>
                    <FontAwesome name='address-book' size={24} color='white' />
                </View>
            ),
            subtitle: 'Contacts who use Zalo',
        },
        {
            id: '3',
            title: 'Birthdays',
            icon: (
                <View style={styles.iconContainer}>
                    <FontAwesome name='gift' size={24} color='white' />
                </View>
            ),
        },
    ];

    // Group contacts by first letter
    const groupedContacts: {
        [key: string]: IFriendRequest[];
    } = {};

    friends.forEach((contact) => {
        const firstLetter = contact.fullName.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    });

    // Create sections for FlatList
    const contactSections = Object.keys(groupedContacts)
        .sort((a, b) => a.localeCompare(b))
        .map((letter) => ({
            title: letter,
            data: groupedContacts[letter],
        }));

    return (
        <ScrollView style={styles.content}>
            {sections.map((section) => (
                <TouchableOpacity
                    key={section.id}
                    style={styles.sectionItem}
                    onPress={section.onPress}
                >
                    {section.icon}
                    <View style={styles.sectionTextContainer}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.subtitle && (
                            <Text style={styles.sectionSubtitle}>
                                {section.subtitle}
                            </Text>
                        )}
                    </View>
                    {section.badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {section.badge}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}

            {/* Filters */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'All' && styles.activeFilterButton,
                    ]}
                    onPress={() => setActiveFilter('All')}
                >
                    <Text style={styles.filterText}>All {friends.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'Online' && styles.activeFilterButton,
                    ]}
                    onPress={() => setActiveFilter('Online')}
                >
                    <Text style={styles.filterText}>Recently online</Text>
                </TouchableOpacity>
            </View>

            {/* Contacts List */}
            {contactSections.map((section) => (
                <View key={section.title}>
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                    {section.data.map((contact) => (
                        <TouchableOpacity
                            key={contact.userID}
                            style={styles.contactItem}
                            onPress={() => handleToChatScreen(contact)}
                        >
                            <Image
                                source={{
                                    uri:
                                        contact.avatar ||
                                        'https://via.placeholder.com/50',
                                }}
                                style={styles.avatar}
                            />
                            <Text style={styles.contactName}>
                                {contact.fullName}
                            </Text>
                            <View style={styles.contactActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons
                                        name='call-outline'
                                        size={22}
                                        color='#666'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons
                                        name='videocam-outline'
                                        size={22}
                                        color='#666'
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}

            {/* Alphabet Index */}
            <View style={styles.alphabetIndex}>
                {ALPHABET.map((letter) => (
                    <TouchableOpacity key={letter} style={styles.indexItem}>
                        <Text style={styles.indexText}>{letter}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

export default FriendTab;

const styles = StyleSheet.create({
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
    searchButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    addButton: {
        padding: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#0084ff',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#0084ff',
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0084ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    sectionTextContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    badge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeText: {
        fontSize: 12,
        color: '#666',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    filterButton: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    activeFilterButton: {
        backgroundColor: '#d0d0d0',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        marginRight: 15,
    },
    contactName: {
        flex: 1,
        fontSize: 16,
    },
    contactActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 5,
    },
    alphabetIndex: {
        position: 'absolute',
        right: 5,
        top: 200,
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
});
