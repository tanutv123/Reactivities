import {Tab} from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos.tsx";
import {Profile} from "../../app/models/profile.ts";
import {observer} from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout.tsx";
import {useStore} from "../../app/stores/store.ts";
import ProfileFollowings from "./ProfileFollowings.tsx";
import ProfileActivities from "./ProfileActivities.tsx";

interface Props {
    profile: Profile;
}

function ProfileContent({profile} : Props) {
    const {profileStore} = useStore();
    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout/>},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile}/>},
        {menuItem: 'Events', render: () => <ProfileActivities/>},
        { menuItem: 'Followers', render: () => <ProfileFollowings /> },
        { menuItem: 'Following', render: () => <ProfileFollowings /> }
    ];
    return <Tab
        menu={{fluid: true, vertical: true}}
        menuPosition='right'
        onTabChange={(_, data) => profileStore.setActiveTab(data.activeIndex)}
        panes={panes}
    />
}

export default observer(ProfileContent);