import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { sendFriendRequest } from '../services/apiFunctionFriend';
import { IUser, searchUserByPhoneNumber } from '../services/apiFunctionsUser';
import useUserStore from '../stores/userStore';

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ isOpen, onClose }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const { user } = useUserStore();

    useEffect(() => {
        console.log('searchResults', searchResults);
    }, [searchResults]);

    const handleSearch = async () => {
        try {
            const res = await searchUserByPhoneNumber(phoneNumber);
            setSearchResults(res);
        } catch (error) {
            Alert.alert(
                'Lỗi khi tìm kiếm người dùng',
                (error as Error).message,
            );
        }
    };

    const handleAddFriend = async (receiverID: string) => {
        try {
            console.log('receiverID', receiverID);
            await sendFriendRequest(receiverID);
            Alert.alert('Đã gửi lời mời kết bạn!');
        } catch (error) {
            Alert.alert(
                'Lỗi khi gửi lời mời kết bạn',
                (error as Error).message,
            );
            console.log('error', error);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType='fade'
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Thêm bạn</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name='close' size={24} color='#666' />
                        </TouchableOpacity>
                    </View>

                    {/* Search input */}
                    <View style={styles.searchContainer}>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name='call'
                                size={20}
                                color='#666'
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Số điện thoại'
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType='phone-pad'
                            />
                        </View>
                    </View>

                    {/* Search results */}
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsTitle}>
                            Kết quả gần nhất
                        </Text>

                        {searchResults.length > 0 ? (
                            <ScrollView style={styles.resultsList}>
                                {searchResults.map((user) => (
                                    <View key={user.id} style={styles.userItem}>
                                        <View style={styles.userInfo}>
                                            <Image
                                                source={{ uri: user.avatar }}
                                                style={styles.avatar}
                                            />
                                            <View>
                                                <Text style={styles.userName}>
                                                    {user.fullName}
                                                </Text>
                                                <Text style={styles.userPhone}>
                                                    {user.phoneNumber}
                                                </Text>
                                            </View>
                                        </View>
                                        {user?.id !== user.id && (
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() =>
                                                    handleAddFriend(user.id)
                                                }
                                            >
                                                <Text
                                                    style={styles.addButtonText}
                                                >
                                                    Kết bạn
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View style={styles.emptyResults}>
                                <Text style={styles.emptyText}>
                                    Nhập số điện thoại để tìm kiếm bạn bè
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.searchButton]}
                            onPress={handleSearch}
                        >
                            <Text style={styles.searchButtonText}>
                                Tìm kiếm
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    searchContainer: {
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
    },
    resultsContainer: {
        flex: 1,
    },
    resultsTitle: {
        fontSize: 12,
        color: '#666',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    resultsList: {
        maxHeight: 300,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userName: {
        fontSize: 14,
        fontWeight: '500',
    },
    userPhone: {
        fontSize: 12,
        color: '#666',
    },
    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#e6f0ff',
    },
    addButtonText: {
        color: '#005ae0',
        fontSize: 12,
        fontWeight: '700',
    },
    emptyResults: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        gap: 8,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    cancelButton: {
        backgroundColor: '#e5e5e5',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    searchButton: {
        backgroundColor: '#005ae0',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default AddFriendModal;
