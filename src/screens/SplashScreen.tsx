import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Animated, Easing, Image, StyleSheet, Text } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { getCurrentUser } from '../services/authService';
import useUserStore from '../stores/userStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SplashScreen'>;

export default function SplashScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { setUser } = useUserStore();

    const logoOpacity = new Animated.Value(0);
    const logoScale = new Animated.Value(0.3);
    const textOpacity = new Animated.Value(0);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập từ AsyncStorage
        const checkLoginStatus = async () => {
            try {
                const userToken = await AsyncStorage.getItem('accessToken');

                if (!userToken) {
                    navigation.navigate('Login');
                    return;
                }

                const user = await getCurrentUser();

                if (!user) throw new Error('User not found');

                setUser(user);
                navigation.navigate('Home');
            } catch (error) {
                console.error('Lỗi khi kiểm tra đăng nhập:', error);
                navigation.navigate('Login');
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        // Start animations
        Animated.sequence([
            // Fade in and scale up logo
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    useNativeDriver: true,
                }),
            ]),

            // Fade in text
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),

            // Hold for a moment
            Animated.delay(1200),
        ]).start(() => {
            // Animation complete, notify parent
        });

        return () => {
            // Clean up animations
            logoOpacity.setValue(0);
            logoScale.setValue(0.3);
            textOpacity.setValue(0);
        };
    }, []);

    return (
        <LinearGradient
            colors={['#0084ff', '#0099ff', '#00a7ff']}
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    },
                ]}
            >
                <Image
                    source={require('../assets/images/qr-code.png')}
                    style={styles.logo}
                    resizeMode='contain'
                />
            </Animated.View>

            <Animated.View style={{ opacity: textOpacity }}>
                <Text style={styles.appName}>AloZola</Text>
                <Text style={styles.tagline}>
                    Connect with friends instantly
                </Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
});
