import React, { Fragment } from 'react';
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { isArchive, isAudio, isDocument, isImage, isVideo } from '../utils';
import { MessageAudio } from './MessageAudio';
import { MessageVideo } from './MessageVideo';

export interface IMessageMedia {
    url: string;
    type: string;
    content: string;
}

export const MessageMedia = ({ medias }: { medias: Array<IMessageMedia> }) => {
    if (medias.length === 0) return null;

    const handleOpenPDF = async (url: string) => {
        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                console.error('Cannot open Document file');
            }
        } catch (error) {
            console.error('Error opening Document:', error);
        }
    };

    return (
        <>
            {medias.map((media) => (
                <Fragment key={media.url}>
                    {isImage(media.type) && (
                        <Image
                            style={styles.messageImage}
                            source={{ uri: media.url }}
                        />
                    )}

                    {isVideo(media.type) && <MessageVideo url={media.url} />}
                    {isAudio(media.type) && (
                        <MessageAudio url={media.url} name={media.content} />
                    )}

                    {isDocument(media.type) && (
                        <TouchableOpacity
                            onPress={() => handleOpenPDF(media.url)}
                        >
                            <View style={styles.pdfContainer}>
                                <Text style={styles.pdfText}>
                                    📄 {media.content ?? 'Document File'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {isArchive(media.type) && (
                        <TouchableOpacity>
                            <View style={styles.pdfContainer}>
                                <Text style={styles.pdfText}>
                                    📄 {media.content ?? 'PDF File'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </Fragment>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    messageImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 5,
    },
    pdfContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    pdfText: {
        fontSize: 16,
        color: '#000',
    },
});
