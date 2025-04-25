import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

export const MessageVideo = ({ url }: { url: string }) => {
    const player = useVideoPlayer(url, (player) => {
        player.loop = true;
        player.play();
    });

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    useEffect(() => {
        if (isPlaying) {
            player.play();
        } else {
            player.pause();
        }
    }, [isPlaying]);

    return (
        <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
        />
    );
};

const styles = StyleSheet.create({
    video: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
    },
});
