import {User, UserFormValues} from "../models/user.ts";
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent.ts";
import {store} from "./store.ts";
import {router} from "../router/route.tsx";

export default class UserStore {
    user: User | null = null;
    refreshTokenTimeout?: number;
    fbLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        const user = await agent.Account.login(creds);
        store.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        runInAction(() => this.user = user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }
    loginAsBob = async () => {
        const user = await agent.Account.loginAsBob();
        store.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        runInAction(() => this.user = user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    register = async (creds: UserFormValues) => {
        await agent.Account.register(creds);
        router.navigate(`/account/registerSuccess?email=${creds.email}`);
        store.modalStore.closeModal();
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        const user = await agent.Account.current();
        store.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        runInAction(() => {
            this.user = user;
        });
    }

    setImage = (image: string) => {
        if (this.user) {
            this.user.image = image;
        }
    }

    setDisplayName = (displayName: string) => {
        if (this.user) {
            this.user.displayName = displayName;
        }
    }

    refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.Account.refreshToken();
            runInAction(() => {
                this.user = user;
            });
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch(error) {
            console.log(error);
        }
    }

    private startRefreshTokenTimer(user: User) {
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (30 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
        console.log({refreshTimeout: this.refreshTokenTimeout});
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    facebookLogin = async (accessToken: string) => {
        try {
            this.fbLoading = true;
            const user = await agent.Account.fbLogin(accessToken);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
                this.fbLoading = false;
            });
            router.navigate('/activities')
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.fbLoading = false;
            })
        }
    }
}