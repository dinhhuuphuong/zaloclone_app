import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { Fragment } from 'react';
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    isArchive,
    isAudio,
    isDocument,
    isImage,
    isVideo,
    showError,
} from '../utils';
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

    const downloadFile = async (
        url: string,
        filename: string,
        isPdf?: boolean,
    ) => {
        try {
            if (isPdf) {
                handleOpenPDF(url);
                return;
            }

            // Tạo đường dẫn đầy đủ để lưu file
            const fileUri = FileSystem.documentDirectory + filename;

            // Tạo callback theo dõi tiến trình nếu được cung cấp
            const callback = undefined;

            // Tạo đối tượng DownloadResumable
            const downloadResumable = FileSystem.createDownloadResumable(
                url,
                fileUri,
                {},
                callback,
            );

            // Bắt đầu tải xuống
            const result = await downloadResumable.downloadAsync();
            console.log('Tải xuống hoàn tất, file được lưu tại: ', result?.uri);

            // Kiểm tra xem thiết bị có hỗ trợ chia sẻ không
            const isSharingAvailable = await Sharing.isAvailableAsync();

            if (isSharingAvailable && result?.uri) {
                // Mở file bằng ứng dụng mặc định trên thiết bị
                await Sharing.shareAsync(result.uri);
            } else {
                alert('Chia sẻ không khả dụng trên thiết bị này');
            }
        } catch (error) {
            console.error('Lỗi khi tải file:', error);
            showError(error, 'Lỗi khi tải file');
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
                            onPress={() =>
                                downloadFile(
                                    media.url,
                                    media.content,
                                    media.type === 'pdf',
                                )
                            }
                        >
                            <View style={styles.pdfContainer}>
                                <Text style={styles.pdfText}>
                                    📄 {media.content ?? 'Document File'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {isArchive(media.type) && (
                        <TouchableOpacity
                            onPress={() =>
                                downloadFile(media.url, media.content)
                            }
                        >
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
