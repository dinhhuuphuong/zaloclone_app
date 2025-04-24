import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import useChatStore from '../stores/chatStore';
import useGroupStore, { User } from '../stores/groupStore';
import useUserStore from '../stores/userStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Options'>;

export default function OptionsScreen() {
    const { chat } = useChatStore();
    const { group } = useGroupStore();
    const navigation = useNavigation<NavigationProp>();
    const { user } = useUserStore();
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
                        <TouchableOpacity style={styles.optionItem}>
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
                        <TouchableOpacity style={styles.optionItem}>
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
                            Danh sách thành viên (5)
                        </Text>
                        <TouchableOpacity>
                            <Feather
                                name='more-vertical'
                                size={20}
                                color='#666'
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Members List */}
                    {members.map((member) => (
                        <View key={member.userID} style={styles.memberItem}>
                            <View style={styles.memberAvatarContainer}>
                                <Image
                                    source={{ uri: member.avatar }}
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
                                    {member.fullName}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
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
});
