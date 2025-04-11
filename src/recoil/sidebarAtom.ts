import { atom } from 'recoil';

export const currentTabState = atom({
    key: 'currentTabState',
    default: 'chat',
});
