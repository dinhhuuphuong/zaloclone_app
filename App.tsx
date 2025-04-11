import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

const StyledSafeAreaView = styled(SafeAreaView);

export default function App() {
    return (
        <StyledSafeAreaView className='flex-1'>
            <AppNavigator />
            <StatusBar style='auto' />
        </StyledSafeAreaView>
    );
}
