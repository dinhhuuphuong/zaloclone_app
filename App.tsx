import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import HomeScreen from './screens/HomeScreen';

const StyledSafeAreaView = styled(SafeAreaView);

export default function App() {
    return (
        <StyledSafeAreaView className='flex-1'>
            <HomeScreen />
            <StatusBar style='auto' />
        </StyledSafeAreaView>
    );
}
