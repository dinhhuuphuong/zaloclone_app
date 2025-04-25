import React from 'react';
import { Image, StyleSheet } from 'react-native';

export const Avatar = ({ avatar }: { avatar?: string }) => {
    return (
        <Image
            style={styles.container}
            source={
                avatar
                    ? {
                          uri: avatar,
                      }
                    : require('../assets/images/225-default-avatar.png')
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
});
