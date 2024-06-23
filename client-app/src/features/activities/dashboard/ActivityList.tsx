import {Header} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store.ts";
import {observer} from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem.tsx";
import {Fragment} from "react";


function ActivityList() {
    const {activityStore} = useStore();
    const {groupedActivities} = activityStore;


    return (
        <>
            <>
                {groupedActivities.map(([group, activities]) => (
                    <Fragment key={group}>
                        <Header sub color='teal'>
                            {group}
                        </Header>
                        {activities && activities.map(activity => (
                            <ActivityListItem key={activity.id} activity={activity}/>
                        ))}
                    </Fragment>
                ))}
            </>
        </>
    );
}

export default observer(ActivityList);