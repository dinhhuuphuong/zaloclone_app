import { Ionicons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MessageAudio = ({ name, url }: { name: string; url: string }) => {
    const [sound, setSound] = useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

    async function playSound() {
        if (!sound) return;

        if (isFinished) {
            // Nếu đã phát xong, phát lại từ đầu
            await sound.setPositionAsync(0);
            setIsFinished(false);
        }

        await sound.playAsync();
        setIsPlaying(true);
    }

    async function pauseSound() {
        if (!sound) return;

        await sound.pauseAsync();
        setIsPlaying(false);
    }

    useEffect(() => {
        async function prepareSound() {
            const { sound } = await Audio.Sound.createAsync(
                {
                    uri: url,
                },
                {
                    shouldPlay: false,
                },
                onPlaybackStatusUpdate,
            );
            setSound(sound);
        }

        prepareSound();
    }, [url]);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setStatus(status);

            if (status.didJustFinish) {
                setIsPlaying(false);
                setIsFinished(true);
            }
        }
    };

    useEffect(() => {
        return sound
            ? () => {
                  console.log('Unloading Sound');
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    const renderIcon = () => {
        if (isFinished) {
            return <Ionicons name='reload' size={24} color='#3478F6' />;
        } else if (isPlaying) {
            return <Ionicons name='pause' size={24} color='#3478F6' />;
        } else {
            return <Ionicons name='play' size={24} color='#3478F6' />;
        }
    };

    const handlePress = () => {
        if (isPlaying) {
            pauseSound();
        } else {
            playSound();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                {renderIcon()}
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.duration}>
                    {status?.isLoaded
                        ? `${Math.floor(
                              (status.positionMillis || 0) / 1000,
                          )}s / ${Math.floor(
                              (status.durationMillis || 0) / 1000,
                          )}s`
                        : 'Đang tải...'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#F0F2F5',
        borderRadius: 12,
        minWidth: 200,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E4E6EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    name: {
        flex: 1,
        fontWeight: '500',
        fontSize: 14,
        marginBottom: 4,
        color: '#1C1E21',
    },
    duration: {
        fontSize: 12,
        color: '#65676B',
    },
});
