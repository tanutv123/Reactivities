import {createBrowserRouter, Navigate, RouteObject} from "react-router-dom";
import App from "../layout/App.tsx";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard.tsx";
import ActivityForm from "../../features/activities/form/ActivityForm.tsx";
import ActivityDetails from "../../features/activities/details/ActivityDetails.tsx";
import TestErrors from "../../features/errors/TestError.tsx";
import NotFound from "../../features/errors/NotFound.tsx";
import ServerError from "../../features/errors/ServerError.tsx";
import ProfilePage from "../../features/profiles/ProfilePage.tsx";
import RequireAuth from "./RequireAuth.tsx";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            {element: <RequireAuth/>, children: [
                    {path: 'activities', element: <ActivityDashboard/>},
                    {path: 'activities/:id', element: <ActivityDetails/>},
                    {path: 'createActivity', element: <ActivityForm key='create'/>},
                    {path: 'manage/:id', element: <ActivityForm key='manage'/>},
                    {path: 'profiles/:username', element: <ProfilePage/>},
                    {path: 'errors', element: <TestErrors/>}
                ]},
            {path: 'not-found', element: <NotFound/>},
            {path: 'server-error', element: <ServerError/>},
            {path: '*', element: <Navigate to='not-found' replace/>},
        ]
    }
];
export const router = createBrowserRouter(routes);