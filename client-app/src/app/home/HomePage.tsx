import {Button, Container, Header, Image, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useStore} from "../stores/store.ts";
import LoginForm from "../../features/users/LoginForm.tsx";
import RegisterForm from "../../features/users/RegisterForm.tsx";

function HomePage() {
    const {userStore, modalStore} = useStore();

    return <Segment inverted textAlign='center' vertical className='masthead'>
        <Container text>
            <Header as='h1' inverted>
                <Image size='massive' src='/assets/logo.png' alt='logo' style={{margin: 12}}/>
                Reactivities!!!
            </Header>
            {userStore.isLoggedIn ? (
                <>
                    <Header as='h2' inverted content='Welcome to Reactivities'/>
                    <Button as={Link} to='/activities' size='huge' inverted>
                        Go to Activities!
                    </Button>
                </>
            ) : (
                <>
                    <Header as='h2' inverted content='Welcome to Reactivities'/>
                    <Button onClick={() => modalStore.openModal(<LoginForm/>)} size='huge' inverted>
                        Login!
                    </Button>
                    <Button onClick={() => modalStore.openModal(<RegisterForm/>)} size='huge' inverted>
                        Register!
                    </Button>
                </>
            )}

        </Container>
    </Segment>
}
export default observer(HomePage);