import {Grid, Loader} from "semantic-ui-react";
import ActivityList from "./ActivityList.tsx";
import {useStore} from "../../../app/stores/store.ts";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import ActivityFilters from "./ActivityFilters.tsx";
import {PagingParams} from "../../../app/models/pagination.ts";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder.tsx";



function ActivityDashboard() {
    const {activityStore} = useStore();
    const {activityRegistry, loadActivities, setPagingParams, pagination} = activityStore
    const [loadingNext, setLoadingNext] = useState(false);

    function HandleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }


    useEffect(() => {
        if (activityRegistry.size <= 1) {
            loadActivities();
        }
    }, [loadActivities, activityRegistry.size]);

    // if (activityStore.loadingInitial && !loadingNext) {
    //     return(
    //         <LoadingComponent content='Loading activities...'/>
    //     );
    // }
    return (
        <Grid>
            <Grid.Column width="10">
                {activityStore.loadingInitial && activityStore.activityRegistry.size === 0&& !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder/>
                        <ActivityListItemPlaceholder/>
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={HandleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList/>
                    </InfiniteScroll>
                )}

            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters/>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext}/>
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);