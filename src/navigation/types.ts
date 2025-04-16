import { IUserBase, SearchUserByPhoneNumber } from '../types/user';

export type RootStackParamList = {
    Home: undefined;
    Register: undefined;
    Login: undefined;
    Chat: undefined;
    Profile: { userId: string } | undefined;
    Contacts: undefined;
    Discover: undefined;
    Settings: undefined;
    ForgotPassword: undefined;
    UpdatePassword: undefined;
    AddFriends: undefined;
    AddFriend: IUserBase;
    OtherUserProfile: SearchUserByPhoneNumber;
};
