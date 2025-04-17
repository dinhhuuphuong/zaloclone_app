import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import useFriendRequestsStore from '../../stores/friendRequestsStore';
import { IFriendRequest } from '../../types/friend';

const ReceivedTab = () => {
    const { friendRequests, setFriendRequests } = useFriendRequestsStore();

    const handleDecline = (id: string) => {
        setFriendRequests(
            friendRequests.map((request) =>
                request.userID === id
                    ? { ...request, status: 'declined' }
                    : request,
            ),
        );
    };

    const handleAccept = (id: string) => {
        setFriendRequests(
            friendRequests.map((request) =>
                request.userID === id
                    ? { ...request, status: 'accepted' }
                    : request,
            ),
        );
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
                            onPress={() => handleDecline(item.userID)}
                        >
                            <Text style={styles.declineButtonText}>
                                Decline
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAccept(item.userID)}
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
