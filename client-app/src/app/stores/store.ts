import ActivityStore from "./activityStore.ts";
import {createContext, useContext} from "react";
import CommonStore from "./commonStore.ts";
import UserStore from "./userStore.ts";
import ModalStore from "./modalStore.ts";
import ProfileStore from "./profileStore.ts";

interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}