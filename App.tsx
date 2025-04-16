import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native';
import { SocketProvider } from './src/contexts/SocketContext';
import AppNavigator from './src/navigation/AppNavigator';

const StyledSafeAreaView = styled(SafeAreaView);

export default function App() {
    return (
        <StyledSafeAreaView className='flex-1'>
            <SocketProvider>
                <AppNavigator />
            </SocketProvider>
            <StatusBar backgroundColor='#0084ff' />
        </StyledSafeAreaView>
    );
}
