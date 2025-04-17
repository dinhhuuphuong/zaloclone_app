import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type SentRequest = {
    id: string;
    name: string;
    avatar: string;
    source: string;
    timeInfo: string;
    status: 'sent' | 'recalled';
};

const SentTab = () => {
    const [sentRequests, setSentRequests] = useState<SentRequest[]>([
        {
            id: '1',
            name: 'Út',
            avatar: 'https://via.placeholder.com/100',
            source: 'From chat conversation',
            timeInfo: '17 minutes ago',
            status: 'sent',
        },
        {
            id: '2',
            name: 'Dương Đức Duy',
            avatar: 'https://via.placeholder.com/100',
            source: 'From Mutual group',
            timeInfo: '05/03',
            status: 'sent',
        },
        {
            id: '3',
            name: 'Giang',
            avatar: 'https://via.placeholder.com/100',
            source: 'From chat conversation',
            timeInfo: '18/02',
            status: 'sent',
        },
        {
            id: '4',
            name: 'Thu Ha',
            avatar: 'https://via.placeholder.com/100',
            source: 'People you may know',
            timeInfo: '',
            status: 'sent',
        },
        {
            id: '5',
            name: 'Sim Minh Ngoc',
            avatar: 'https://via.placeholder.com/100',
            source: 'People you may know',
            timeInfo: '',
            status: 'sent',
        },
    ]);

    const handleRecall = (id: string) => {
        setSentRequests(
            sentRequests.map((request) =>
                request.id === id
                    ? { ...request, status: 'recalled' }
                    : request,
            ),
        );
    };

    const renderSentRequest = ({ item }: { item: SentRequest }) => {
        if (item.status !== 'sent') return null;

        return (
            <View style={styles.requestItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.requestInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.sourceContainer}>
                        <Text style={styles.sourceText}>{item.source}</Text>
                        {item.timeInfo ? (
                            <Text style={styles.timeInfo}>{item.timeInfo}</Text>
                        ) : null}
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.recallButton}
                    onPress={() => handleRecall(item.id)}
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
            keyExtractor={(item) => item.id}
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
