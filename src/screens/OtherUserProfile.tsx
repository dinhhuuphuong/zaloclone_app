import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { cancelFriendRequest } from '../services/apiFunctionFriend';
import { haveTheyChatted } from '../services/conversationService';
import useChatStore from '../stores/chatStore';
import useFriendRequestsStore from '../stores/friendRequestsStore';
import useFriendsStore from '../stores/friendsStore';
import useSentFriendRequestsStore from '../stores/sentFriendRequestsStore';
import { showError } from '../utils';

// Define types for suggested friends
type SuggestedFriend = {
    id: string;
    name: string;
    avatar: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddFriend'>;
type RouteProps = RouteProp<RootStackParamList, 'OtherUserProfile'>;

const NOT_FRIEND = 0;
const SENT = 1;
const RECEIVED = 2;
const FRIEND = 3;

export default function OtherUserProfile() {
    const { setChat } = useChatStore();
    const { friends } = useFriendsStore();
    const { sentRequests, setSentRequests } = useSentFriendRequestsStore();
    const { friendRequests } = useFriendRequestsStore();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const userInfo = route.params;
    const relationshipStatus = useMemo(() => {
        const isFriend = friends.some(
            (friend) => friend.userID === userInfo.userID,
        );

        if (isFriend) return FRIEND;

        const isSentRequest = sentRequests.some(
            (request) => request.userID === userInfo.userID,
        );

        if (isSentRequest) return SENT;

        const isReceivedRequest = friendRequests.some(
            (request) => request.userID === userInfo.userID,
        );

        if (isReceivedRequest) return RECEIVED;

        return NOT_FRIEND;
    }, [friends, sentRequests, friendRequests, userInfo.userID]);

    const handleToChatScreen = async () => {
        try {
            const response = await haveTheyChatted(userInfo.userID);

            setChat({
                ...userInfo,
                conversationID: response
                    ? response.convDetails.conversationID
                    : undefined,
            });
            navigation.navigate('Chat');
        } catch (error) {
            setChat({
                ...userInfo,
                conversationID: undefined,
            });
            navigation.navigate('Chat');
        }
    };

    // Sample data for suggested friends
    const suggestedFriends: SuggestedFriend[] = [
        {
            id: '1',
            name: 'Lê Thanh Tùng',
            avatar: 'https://via.placeholder.com/100',
        },
        {
            id: '2',
            name: 'Tq Nhat Habibi',
            avatar: 'https://via.placeholder.com/100?text=HTML5',
        },
        {
            id: '3',
            name: 'Phạm Bá Bắc',
            avatar: 'https://via.placeholder.com/100',
        },
    ];

    const handleBack = () => {
        navigation.goBack();
    };

    const handleDecline = () => {
        console.log('Decline');
    };

    const handleAccept = () => {
        console.log('Accept');
    };

    const handleRecall = async (id: string) => {
        try {
            await cancelFriendRequest(id);

            setSentRequests(
                sentRequests.filter((request) => request.userID !== id),
            );
        } catch (error) {
            showError(error, 'Recall request failed');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView} bounces={false}>
                {/* Header */}
                <ImageBackground
                    source={require('../assets/images/photo-1741513543210-c17d608be117.png')}
                    style={styles.headerBackground}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                        >
                            <Ionicons
                                name='chevron-back'
                                size={28}
                                color='white'
                            />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.headerButton}>
                                <Ionicons
                                    name='call-outline'
                                    size={24}
                                    color='white'
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton}>
                                <Feather
                                    name='more-horizontal'
                                    size={24}
                                    color='white'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Profile Picture */}
                    <View style={styles.profilePictureContainer}>
                        <Image
                            source={
                                userInfo.avatar
                                    ? { uri: userInfo.avatar }
                                    : require('../assets/images/225-default-avatar.png')
                            }
                            style={styles.profilePicture}
                        />
                    </View>
                </ImageBackground>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.profileName}>
                            {userInfo.fullName}
                        </Text>
                        <TouchableOpacity>
                            <Feather name='edit-2' size={18} color='#666' />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileStatus}>
                        You can't view {userInfo.fullName}'s timeline posts
                        since you're not friends
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.messageButton}
                            onPress={handleToChatScreen}
                        >
                            <Ionicons
                                name='chatbubble-outline'
                                size={20}
                                color='#0084ff'
                            />
                            <Text style={styles.messageButtonText}>
                                Send message
                            </Text>
                        </TouchableOpacity>
                        {relationshipStatus === SENT && (
                            <TouchableOpacity
                                style={styles.recallRequestButton}
                                onPress={() => handleRecall(userInfo.userID)}
                            >
                                <Text style={styles.recallRequestButtonText}>
                                    Recall request
                                </Text>
                            </TouchableOpacity>
                        )}
                        {relationshipStatus === NOT_FRIEND && (
                            <TouchableOpacity
                                style={styles.addFriendButton}
                                onPress={() =>
                                    navigation.navigate('AddFriend', userInfo)
                                }
                            >
                                <Ionicons
                                    name='person-add'
                                    size={24}
                                    color='#666'
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {relationshipStatus === RECEIVED && (
                    <View style={styles.friendRequestCard}>
                        <Text style={styles.requestTitle}>
                            Sent friend request
                        </Text>
                        <View style={styles.zaloNameContainer}>
                            <Ionicons
                                name='person-circle-outline'
                                size={20}
                                color='#666'
                            />
                            <Text style={styles.zaloNameText}>
                                Zalo name: {userInfo.fullName}
                            </Text>
                        </View>
                        <View style={styles.requestButtons}>
                            <TouchableOpacity
                                style={styles.declineButton}
                                onPress={handleDecline}
                            >
                                <Text style={styles.declineButtonText}>
                                    Decline
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={handleAccept}
                            >
                                <Text style={styles.acceptButtonText}>
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Friend Suggestions */}
                <View style={styles.suggestionsContainer}>
                    <View style={styles.suggestionsHeader}>
                        <View style={styles.suggestionsTitle}>
                            <MaterialIcons
                                name='waving-hand'
                                size={20}
                                color='#FFD700'
                            />
                            <Text style={styles.suggestionsTitleText}>
                                Make friends, more fun
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.seeMoreText}>See more</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.friendsGrid}>
                        {suggestedFriends.map((friend) => (
                            <View key={friend.id} style={styles.friendCard}>
                                <TouchableOpacity style={styles.dismissButton}>
                                    <Ionicons
                                        name='close'
                                        size={18}
                                        color='#999'
                                    />
                                </TouchableOpacity>
                                <Image
                                    source={
                                        friend.id === '2'
                                            ? require('../assets/images/225-default-avatar.png')
                                            : { uri: friend.avatar }
                                    }
                                    style={styles.friendAvatar}
                                />
                                <Text
                                    style={styles.friendName}
                                    numberOfLines={1}
                                >
                                    {friend.name}
                                </Text>
                                <TouchableOpacity style={styles.addButton}>
                                    <Text style={styles.addButtonText}>
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    headerBackground: {
        height: 250,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRight: {
        flexDirection: 'row',
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
    profilePictureContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: -50,
        left: 0,
        right: 0,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'white',
    },
    profileInfo: {
        marginTop: 60,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileName: {
        fontSize: 22,
        fontWeight: '600',
        marginRight: 8,
    },
    profileStatus: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 5,
        width: '100%',
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e6f2ff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 10,
    },
    messageButtonText: {
        color: '#0084ff',
        fontWeight: '500',
        marginLeft: 8,
    },
    addFriendButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recallRequestButton: {
        borderRadius: 22.5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    recallRequestButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    divider: {
        height: 8,
        backgroundColor: '#f0f0f0',
        marginTop: 20,
    },
    suggestionsContainer: {
        padding: 15,
    },
    suggestionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    suggestionsTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    suggestionsTitleText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    seeMoreText: {
        color: '#0084ff',
        fontSize: 14,
    },
    friendsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    friendCard: {
        width: cardWidth,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        position: 'relative',
    },
    dismissButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 1,
    },
    friendAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    friendName: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: '#e6f2ff',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    addButtonText: {
        color: '#0084ff',
        fontWeight: '500',
    },
    friendRequestCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    requestTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    zaloNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    zaloNameText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    requestButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    declineButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 10,
    },
    declineButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#0084ff',
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});
