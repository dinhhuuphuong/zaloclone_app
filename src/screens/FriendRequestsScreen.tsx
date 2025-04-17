import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReceivedTab from '../components/friendRequestTab/ReceivedTab';
import SentTab from '../components/friendRequestTab/SentTab';
import { RootStackParamList } from '../navigation/types';

type TabType = 'received' | 'sent';

type NavigationProp = StackNavigationProp<RootStackParamList, 'FriendRequests'>;

export default function FriendRequestsScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('sent');
    const navigation = useNavigation<NavigationProp>();

    const handleBackButton = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackButton}
                >
                    <Ionicons name='chevron-back' size={28} color='white' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Friend Requests</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name='settings-outline' size={24} color='white' />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <Pressable
                    style={[
                        styles.tab,
                        activeTab === 'received' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('received')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'received' && styles.activeTabText,
                        ]}
                    >
                        Received 22
                    </Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.tab,
                        activeTab === 'sent' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('sent')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'sent' && styles.activeTabText,
                        ]}
                    >
                        Sent 5
                    </Text>
                </Pressable>
            </View>

            {/* Sent Requests List */}
            {(activeTab === 'sent' && <SentTab />) || <ReceivedTab />}
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
        justifyContent: 'space-between',
        backgroundColor: '#0084ff',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    settingsButton: {
        padding: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
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
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#0084ff',
        fontWeight: '500',
    },
});
