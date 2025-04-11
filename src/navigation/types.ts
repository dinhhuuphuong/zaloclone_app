export type RootStackParamList = {
    Home: undefined;
    Register: undefined;
    Login: undefined;
    Chat: { userId: string; userName: string };
    Profile: { userId: string } | undefined;
    Contacts: undefined;
    Discover: undefined;
    Settings: undefined;
};
