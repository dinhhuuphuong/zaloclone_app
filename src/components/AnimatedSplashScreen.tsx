import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

interface AnimatedSplashScreenProps {
    onAnimationComplete: () => void;
}

export default function AnimatedSplashScreen({
    onAnimationComplete,
}: AnimatedSplashScreenProps) {
    // Animation values
    const logoScale = new Animated.Value(0.3);
    const logoOpacity = new Animated.Value(0);
    const textOpacity = new Animated.Value(0);
    const textTranslateY = new Animated.Value(20);

    useEffect(() => {
        // Start animations
        Animated.sequence([
            // Fade in and scale up logo
            Animated.parallel([
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),

            // Fade in and slide up text
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),

            // Wait a bit before finishing
            Animated.delay(1000),
        ]).start(() => {
            onAnimationComplete();
        });
    }, []);

    return (
        <LinearGradient
            colors={['#0084ff', '#0099ff', '#00a7ff']}
            style={styles.container}
        >
            <View style={styles.content}>
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
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode='contain'
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            opacity: textOpacity,
                            transform: [{ translateY: textTranslateY }],
                        },
                    ]}
                >
                    <Text style={styles.appName}>AloZola</Text>
                    <Text style={styles.tagline}>
                        Connect with friends instantly
                    </Text>
                </Animated.View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
    },
    textContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});
