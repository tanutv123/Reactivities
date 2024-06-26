import {Photo, Profile} from "../models/profile.ts";
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent.ts";
import {store} from "./store.ts";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    loadingEditProfile = false;
    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.userName === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string)=> {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
               if (this.profile) {
                   this.profile.photos?.push(photo);
                   if (photo.isMain && store.userStore.user) {
                       store.userStore.setImage(photo.url);
                       this.profile.image = photo.url;
                   }
               }
               this.uploading = false;
            });
        } catch (e) {
            console.log(e);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(x => x.isMain)!.isMain = false;
                    this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })

        } catch (e) {
            console.log(e);
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(x => x.id !== photo.id);
                    this.loading = false;
                }
            });
        } catch (e) {
            console.log(e);
            runInAction(() => this.loading = false);
        }
    }

    editProfile = async (profile: Partial<Profile>) => {
        this.loadingEditProfile = true;
        try {
            await agent.Profiles.editProfile(profile);
            runInAction(() => {
                if (profile.displayName && store.userStore.user?.displayName !== profile.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = {...this.profile, ...profile as Profile};
                this.loadingEditProfile = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(() => {
                this.loadingEditProfile = false;
            })
        }
    }

}