export interface IUserBase {
    userID: string;
    fullName: string;
    avatar: string;
}

export interface SearchUserByPhoneNumber extends IUserBase {
    createAt: number;
    dayOfBirth: string;
    destroy: boolean;
    gender: boolean;
    passWord: string;
    phoneNumber: string;
    role: string;
    slug: string;
    updateAt: number;
}
