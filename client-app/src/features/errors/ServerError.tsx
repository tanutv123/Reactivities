import {useStore} from "../../app/stores/store.ts";
import {Container, Header, Segment} from "semantic-ui-react";

export default function ServerError() {
    const {commonStore} = useStore();
    return <Container>
        <Header as='h1' content='Server error'/>
        <Header sub as='h5' content={commonStore.error?.message}/>
        {commonStore.error?.details && (
            <Segment>
                <Header as='h4' content='Stack trace' color='teal'/>
                <code style={{marginTop: 10}}>{commonStore.error.details}</code>
            </Segment>
        )}
    </Container>;
}