import {Button, Header, Icon, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default function NotFound() {
    return <Segment placeholder>
        <Header icon>
            <Icon name='search'/>
            Oops - Resource not found
        </Header>
        <Segment.Inline>
            <Button as={Link} to='/activities'>
                Return to activity dashboard
            </Button>
        </Segment.Inline>
    </Segment>;
}