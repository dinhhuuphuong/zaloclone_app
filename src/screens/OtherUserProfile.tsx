import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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

// Define types for suggested friends
type SuggestedFriend = {
    id: string;
    name: string;
    avatar: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddFriend'>;
type RouteProps = RouteProp<RootStackParamList, 'OtherUserProfile'>;

export default function OtherUserProfile() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const userInfo = route.params;

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
                        <TouchableOpacity style={styles.messageButton}>
                            <Ionicons
                                name='chatbubble-outline'
                                size={20}
                                color='#0084ff'
                            />
                            <Text style={styles.messageButtonText}>
                                Send message
                            </Text>
                        </TouchableOpacity>
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
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

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
});
