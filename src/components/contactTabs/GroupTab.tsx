import {
    Feather,
    FontAwesome,
    Ionicons,
    MaterialIcons,
} from '@expo/vector-icons';
import type React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Define types for our data
type GroupCategory = {
    id: string;
    title: string;
    icon: React.ReactNode;
};

type Group = {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    hasBirthday?: boolean;
    birthdayPerson?: string;
};

const GroupTab = () => {
    // Sample data for group categories
    const groupCategories: GroupCategory[] = [
        {
            id: '1',
            title: 'Calendar',
            icon: <FontAwesome name='calendar' size={24} color='#0084ff' />,
        },
        {
            id: '2',
            title: 'Reminder',
            icon: <MaterialIcons name='alarm' size={24} color='#ff4d6d' />,
        },
        {
            id: '3',
            title: 'Offline Group',
            icon: <Ionicons name='people-circle' size={24} color='#7868e6' />,
        },
    ];

    // Sample data for joined groups
    const joinedGroups: Group[] = [
        {
            id: '1',
            name: '[Dev&Tech] Nhóm Hỗ Trợ...',
            avatar: 'https://via.placeholder.com/60',
            lastMessage: 'Nguyen Duc Truong...: Tôi thể mọi người c...',
            time: '8 seconds',
            hasBirthday: true,
            birthdayPerson: 'Nguyễn Minh Thông',
        },
        {
            id: '2',
            name: 'Job FrontEnd Remote/Onsite',
            avatar: 'https://via.placeholder.com/60',
            lastMessage: 'Nhung: #Remote #Frontend...',
            time: '29 minutes',
        },
        {
            id: '3',
            name: '14. TKT.NEW AI | 15-16....',
            avatar: 'https://via.placeholder.com/60',
            lastMessage: 'Trần Nghĩnh will go to Vào ZOOM 19h15 T...',
            time: '44 minutes',
            hasBirthday: true,
            birthdayPerson: 'Phạm Tiến Sỹ',
        },
        {
            id: '4',
            name: 'Job ReactJS Remote/Onsite',
            avatar: 'https://via.placeholder.com/60',
            lastMessage: 'Đạt: @Phạm Linh cho e xin jd của fres với...',
            time: '3 hours',
        },
        {
            id: '5',
            name: '13/3 - Huấn Luyện Trợ Lý A...',
            avatar: 'https://via.placeholder.com/60',
            lastMessage: 'Phạm Thị Hương Lan: [Photo] 📢 THÔNG...',
            time: '6 hours',
        },
    ];

    return (
        <ScrollView style={styles.content}>
            {/* Create Group */}
            <TouchableOpacity style={styles.createGroupContainer}>
                <View style={styles.createGroupIconContainer}>
                    <Ionicons name='people' size={24} color='#0084ff' />
                    <View style={styles.plusIconContainer}>
                        <Ionicons name='add' size={14} color='white' />
                    </View>
                </View>
                <Text style={styles.createGroupText}>Create Group</Text>
            </TouchableOpacity>

            {/* Create group with */}
            <View style={styles.createWithSection}>
                <Text style={styles.sectionTitle}>Create group with:</Text>
                <View style={styles.categoryContainer}>
                    {groupCategories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.categoryItem}
                        >
                            <View style={styles.categoryIconContainer}>
                                {category.icon}
                            </View>
                            <Text style={styles.categoryText}>
                                {category.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Joined Groups */}
            <View style={styles.joinedGroupsSection}>
                <View style={styles.joinedGroupsHeader}>
                    <Text style={styles.joinedGroupsTitle}>
                        Joined Groups (83)
                    </Text>
                    <TouchableOpacity style={styles.recentActivityButton}>
                        <Feather name='arrow-up' size={16} color='#666' />
                        <Text style={styles.recentActivityText}>
                            Recent activity
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Group List */}
                {joinedGroups.map((group) => (
                    <TouchableOpacity key={group.id} style={styles.groupItem}>
                        <Image
                            source={{ uri: group.avatar }}
                            style={styles.groupAvatar}
                        />
                        <View style={styles.groupInfo}>
                            <View style={styles.groupNameRow}>
                                <Ionicons
                                    name='people'
                                    size={16}
                                    color='#0084ff'
                                    style={styles.groupIcon}
                                />
                                <Text
                                    style={styles.groupName}
                                    numberOfLines={1}
                                >
                                    {group.name}
                                </Text>
                                <Text style={styles.groupTime}>
                                    {group.time}
                                </Text>
                            </View>
                            <Text style={styles.groupMessage} numberOfLines={1}>
                                {group.lastMessage}
                            </Text>
                            {group.hasBirthday && (
                                <View style={styles.birthdayContainer}>
                                    <Ionicons
                                        name='gift'
                                        size={16}
                                        color='#ff4d6d'
                                    />
                                    <Text style={styles.birthdayText}>
                                        Today is {group.birthdayPerson}'s
                                        birthday
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

export default GroupTab;

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
    createGroupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    createGroupIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e6f3ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        position: 'relative',
    },
    plusIconContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#0084ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createGroupText: {
        fontSize: 16,
        color: '#0084ff',
        fontWeight: '500',
    },
    createWithSection: {
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 8,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 15,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    categoryItem: {
        alignItems: 'center',
        width: 100,
    },
    categoryIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
    },
    joinedGroupsSection: {
        backgroundColor: 'white',
    },
    joinedGroupsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    joinedGroupsTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    recentActivityButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recentActivityText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    groupItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    groupAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    groupInfo: {
        flex: 1,
    },
    groupNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    groupIcon: {
        marginRight: 5,
    },
    groupName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    groupTime: {
        fontSize: 12,
        color: '#666',
    },
    groupMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    birthdayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    birthdayText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
});
