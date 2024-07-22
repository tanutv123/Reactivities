import axios, {AxiosError, AxiosResponse} from "axios";
import {Activity, ActivityFormValues} from "../models/activity.ts";
import {toast} from "react-toastify";
import {router} from "../router/route.tsx";
import {store} from "../stores/store.ts";
import {User, UserFormValues} from "../models/user.ts";
import {Photo, Profile} from "../models/profile.ts";
import {PaginatedResult} from "../models/pagination.ts";
import {UserActivity} from "../models/UserActivity.ts";

const sleep = (delay : number) => {
    return new Promise((resolve) =>{
        setTimeout(resolve, delay);
    });
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(async response => {
        if (import.meta.env.DEV) await sleep(1000);
        const pagination = response.headers['pagination'];
        if (pagination) {
                response.data = new PaginatedResult(response.data, JSON.parse(pagination));
                return response as AxiosResponse<PaginatedResult<any>>;
        }
        return response;
}, (error: AxiosError) => {
    const {data, status, config, headers} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            console.log(data.errors);
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modelStateErrors = [];
                for(const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            if (status === 401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')) {
                store.userStore.logout();
                toast.error('Session expired - please login again')
            } else {
                toast.error('Unauthorized');
            }
            break;
        case 403:
            toast.error('Forbidden');
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;
    }
    return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params})
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post(`/activities`, activity),
    update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    refreshToken: () => requests.post<User>('/account/refreshToken', {}),
    fbLogin: (accessToken: string) => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {}),
    verifyEmail: (email: string, token: string) => requests.post<void>(`/account/verifyEmail?token=${token}&email=${email}`, {}),
    resendEmailConfirm: (email: string) => requests.get(`/account/resendEmailConfirmationLink?email=${email}`)
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photo', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photo/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photo/${id}`),
    editProfile: (profile: Partial<Profile>) => requests.put('/profiles', profile),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests
        .get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) =>
        requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;