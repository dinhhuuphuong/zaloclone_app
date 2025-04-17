import React from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    acceptFriendRequest,
    declineFriendRequest,
} from '../../services/apiFunctionFriend';
import useFriendRequestsStore from '../../stores/friendRequestsStore';
import useFriendsStore from '../../stores/friendsStore';
import { IFriendRequest } from '../../types/friend';
import { showError } from '../../utils';

const ReceivedTab = () => {
    const { friendRequests, setFriendRequests } = useFriendRequestsStore();
    const { friends, setFriends } = useFriendsStore();

    const handleDecline = async (user: IFriendRequest) => {
        try {
            await declineFriendRequest(user.userID);

            setFriendRequests(
                friendRequests.filter(
                    (request) => request.userID !== user.userID,
                ),
            );

            Alert.alert('Success', 'Đã từ chối lời mời kết bạn');
        } catch (error) {
            showError(error, 'Decline request failed');
        }
    };

    const handleAccept = async (user: IFriendRequest) => {
        try {
            await acceptFriendRequest(user.userID);

            setFriendRequests(
                friendRequests.filter(
                    (request) => request.userID !== user.userID,
                ),
            );

            setFriends([...friends, user]);

            Alert.alert('Success', 'Đã chấp nhận lời mời kết bạn');
        } catch (error) {
            showError(error, 'Decline request failed');
        }
    };

    const renderFriendRequest = ({ item }: { item: IFriendRequest }) => {
        return (
            <View style={styles.requestItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.requestInfo}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.requestText}>Wants to be friends</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.declineButton}
                            onPress={() => handleDecline(item)}
                        >
                            <Text style={styles.declineButtonText}>
                                Decline
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAccept(item)}
                        >
                            <Text style={styles.acceptButtonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={friendRequests}
            renderItem={renderFriendRequest}
            keyExtractor={(item) => item.userID}
            contentContainerStyle={styles.listContent}
        />
    );
};

export default ReceivedTab;

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 20,
    },
    requestItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    requestInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    sourceContainer: {
        flexDirection: 'column',
    },
    sourceText: {
        fontSize: 14,
        color: '#666',
    },
    timeInfo: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    recallButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    recallButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    requestText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    declineButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginRight: 10,
    },
    declineButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    acceptButton: {
        backgroundColor: '#e6f2ff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    acceptButtonText: {
        color: '#0084ff',
        fontWeight: '500',
    },
});
