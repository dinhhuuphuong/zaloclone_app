import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import useChatStore from '../stores/chatStore';
import { IConversation } from '../stores/conversationsStore';
import useGroupStore from '../stores/groupStore';
import { parseTimestamp } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const ConversationItem = ({ item }: { item: IConversation }) => {
    const navigation = useNavigation<NavigationProp>();
    const { setChat } = useChatStore();
    const { reset } = useGroupStore();
    const text = useMemo(() => {
        if (!item.lastMessage) return '';

        if (item.lastMessage.messageType === 'text')
            return item.lastMessage.messageContent;

        try {
            const content = JSON.parse(item.lastMessage.messageContent);

            return `${
                Array.isArray(content) && content.length > 1
                    ? `${content.length} files`
                    : '1 file'
            }`;
        } catch (error) {
            return item.lastMessage.messageContent;
        }
    }, [item]);

    return (
        <TouchableOpacity
            onPress={() => {
                if (!item.conversation.receiver) return;

                setChat({
                    ...item.conversation.receiver,
                    conversationID: item.conversation.conversationID,
                });

                reset();

                navigation.navigate('Chat');
            }}
        >
            <View style={styles.messageItem}>
                <Image
                    source={
                        item.conversation.receiver?.avatar
                            ? {
                                  uri: item.conversation.receiver.avatar,
                              }
                            : require('../assets/images/225-default-avatar.png')
                    }
                    style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>
                        {item.conversation.receiver?.fullName}
                    </Text>
                    <Text style={styles.message}>{text}</Text>
                </View>
                <Text style={styles.time}>
                    {item.lastMessage &&
                        parseTimestamp(
                            item.lastMessage?.updatedAt ??
                                item.lastMessage?.createdAt,
                        )}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
});
