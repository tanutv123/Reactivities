import {useStore} from "../stores/store.ts";
import {Navigate, Outlet, useLocation} from "react-router-dom";

export default function RequireAuth() {
    const {userStore: {isLoggedIn}} = useStore();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to='/' state={{from: location}}/>
    }

    return <Outlet/>
}