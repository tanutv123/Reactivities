import {Grid} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store.ts";
import LoadingComponent from "../../../app/layout/LoadingComponent.tsx";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import { useParams} from "react-router-dom";
import ActivityDetailHeader from "./ActivityDetailHeader.tsx";
import ActivityDetailInfo from "./ActivityDetailInfo.tsx";
import ActivityDetailChat from "./ActivityDetailChat.tsx";
import ActivityDetailSidebar from "./ActivityDetailSidebar.tsx";

function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const {id} = useParams();
    useEffect(() => {
        if (id) {
            loadActivity(id);
        }
    }, [id, loadActivity]);

    if (loadingInitial || !activity) return <LoadingComponent/>;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailHeader activity={activity}/>
                <ActivityDetailInfo activity={activity}/>
                <ActivityDetailChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailSidebar/>
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDetails);