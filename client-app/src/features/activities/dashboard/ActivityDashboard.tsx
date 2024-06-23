import {Grid} from "semantic-ui-react";
import ActivityList from "./ActivityList.tsx";
import {useStore} from "../../../app/stores/store.ts";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent.tsx";
import ActivityFilters from "./ActivityFilters.tsx";



function ActivityDashboard() {
    const {activityStore} = useStore();
    const {activityRegistry, loadActivities} = activityStore

    useEffect(() => {
        if (activityRegistry.size <= 1) {
            loadActivities();
        }
    }, [loadActivities, activityRegistry.size]);

    if (activityStore.loadingInitial) {
        return(
            <LoadingComponent content='Loading activities...'/>
        );
    }
    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList/>
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters/>
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);