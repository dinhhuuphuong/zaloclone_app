import { styled } from 'nativewind';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const StyledView = styled(View);

const mockMessages = [
    {
        id: '1',
        name: 'Cloud của tôi',
        message: 'https://www.canva.com/…',
        time: 'T3',
        avatar: {
            uri: 'https://cdn-icons-png.flaticon.com/512/4144/4144467.png',
        },
    },
    {
        id: '2',
        name: 'HayDay 2 💎 Nguyễn Tr…',
        message: 'Nguyễn Trọng: @Nguyễn Hà…',
        time: '33 phút',
        avatar: {
            uri: 'https://static.wikia.nocookie.net/hayday/images/3/3a/Chicken.png',
        },
    },
    {
        id: '3',
        name: 'Nhóm Kiến Trúc',
        message: 'Lê Đại Phát: [Sticker]',
        time: '2 giờ',
        avatar: {
            uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
        },
    },
    {
        id: '4',
        name: 'Ngô Nhật Tùng',
        message: 'dạ okela sếp',
        time: '3 giờ',
        avatar: {
            uri: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
        },
    },
    {
        id: '5',
        name: 'Nguyễn Hồng Quân',
        message: 'nhắn đi',
        time: '3 giờ',
        avatar: {
            uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
        },
    },
];

export default function HomeScreen() {
    return (
        <StyledView className='flex-1 flex-row bg-gray-100'>
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TextInput
                        placeholder='Tìm kiếm'
                        style={styles.searchInput}
                    />
                    <View style={styles.headerIcons}>
                        <Text style={styles.icon}>📷</Text>
                        <Text style={styles.icon}>＋</Text>
                    </View>
                </View>

                {/* TAB */}
                <View style={styles.tab}>
                    <Text style={[styles.tabItem, styles.tabActive]}>
                        Ưu tiên
                    </Text>
                    <Text style={styles.tabItem}>Khác</Text>
                </View>

                {/* DANH SÁCH TIN NHẮN */}
                <FlatList
                    data={mockMessages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.messageItem}>
                            <Image source={item.avatar} style={styles.avatar} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.message}>
                                    {item.message}
                                </Text>
                            </View>
                            <Text style={styles.time}>{item.time}</Text>
                        </View>
                    )}
                />
            </View>
        </StyledView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        backgroundColor: '#0099FF',
        flexDirection: 'row',
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 10,
        alignItems: 'center',
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 10,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    icon: {
        fontSize: 20,
        color: '#fff',
        marginLeft: 10,
    },
    tab: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tabItem: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 10,
        color: '#888',
        fontWeight: '500',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderColor: '#0099FF',
        color: '#000',
    },
    messageItem: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    name: { fontWeight: 'bold', fontSize: 15 },
    message: { color: '#666' },
    time: { marginLeft: 6, color: '#999', fontSize: 12 },
    bottomTab: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    tabIcon: {
        fontSize: 20,
    },
});
