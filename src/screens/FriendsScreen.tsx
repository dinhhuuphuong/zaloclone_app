import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FriendTab from '../components/contactTabs/FriendTab';
import GroupTab from '../components/contactTabs/GroupTab';

export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState('Friends');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name='search' size={24} color='white' />
                    <Text style={styles.searchText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name='person-add' size={24} color='white' />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'Friends' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('Friends')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'Friends' && styles.activeTabText,
                        ]}
                    >
                        Friends
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'Groups' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('Groups')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'Groups' && styles.activeTabText,
                        ]}
                    >
                        Groups
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Sections */}
            {activeTab === 'Friends' && <FriendTab />}
            {activeTab === 'Groups' && <GroupTab />}
        </View>
    );
}

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
