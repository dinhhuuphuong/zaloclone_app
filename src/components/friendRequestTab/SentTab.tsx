import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import useSentFriendRequestsStore from '../../stores/sentFriendRequestsStore';
import { IFriendRequest } from '../../types/friend';

const SentTab = () => {
    const { sentRequests, setSentRequests } = useSentFriendRequestsStore();

    const handleRecall = (id: string) => {
        setSentRequests(
            sentRequests.map((request) =>
                request.userID === id
                    ? { ...request, status: 'recalled' }
                    : request,
            ),
        );
    };

    const renderSentRequest = ({ item }: { item: IFriendRequest }) => {
        return (
            <View style={styles.requestItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.requestInfo}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    {/* <View style={styles.sourceContainer}>
                        <Text style={styles.sourceText}>{item.source}</Text>
                        {item.timeInfo ? (
                            <Text style={styles.timeInfo}>{item.timeInfo}</Text>
                        ) : null}
                    </View> */}
                </View>
                <TouchableOpacity
                    style={styles.recallButton}
                    onPress={() => handleRecall(item.userID)}
                >
                    <Text style={styles.recallButtonText}>Recall</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <FlatList
            data={sentRequests}
            renderItem={renderSentRequest}
            keyExtractor={(item) => item.userID}
            contentContainerStyle={styles.listContent}
        />
    );
};

export default SentTab;

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
});
