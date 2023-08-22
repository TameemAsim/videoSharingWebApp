import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist()

export const searchForMobile = atom<boolean>({
    key: 'SearchForMobile',
    default: false
});

export const searchInput = atom<string>({
    key: 'Search Input',
    default: '',
    effects_UNSTABLE: [persistAtom]
});


export const sideBarEnabled = atom<boolean>({
    key: 'Sidebar Enabled',
    default: false
});

export interface User {
    _id: string,
    username: string,
    email: string,
    subscribers: number,
    subscribedUsers: string[],
    img: string,
    imgName: string
}

export const user = atom<User>({
    key: 'User',
    default: {
        _id: "",
        username: "",
        email: "",
        subscribers: 0,
        subscribedUsers: [],
        img: "",
        imgName: ""
    },
    effects_UNSTABLE: [persistAtom]
});

export interface Video {
    _id: string
    userId: string,
    channelName: string,
    title: string,
    description: string,
    thumbnailURL: string,
    thumbnailName: string,
    videoURL: string,
    videoName: string,
    views: number,
    tags: string[],
    likes: string[],
    dislikes: string[],
    createdAt: Date,
    updatedAt: Date
}

export const userVideos = atom<Video[]>({
    key: 'User Videos',
    default: [],
    effects_UNSTABLE: [persistAtom]
});
