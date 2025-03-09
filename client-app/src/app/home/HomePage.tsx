import {Button, Container, Divider, Header, Image, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useStore} from "../stores/store.ts";
import LoginForm from "../../features/users/LoginForm.tsx";
import RegisterForm from "../../features/users/RegisterForm.tsx";
import FacebookLogin, {FailResponse, SuccessResponse} from "@greatsumini/react-facebook-login";
import {useState} from "react";

function HomePage() {
    const {userStore, modalStore} = useStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    function loginAsBob() {
        setIsSubmitting(true);
        userStore.loginAsBob().finally(() => setIsSubmitting(false));
    }

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
                    <Button loading={isSubmitting} onClick={loginAsBob} size='huge' inverted>
                        Login As Bob!
                    </Button>
                    <Button onClick={() => modalStore.openModal(<RegisterForm/>)} size='huge' inverted>
                        Register!
                    </Button>
                    <Divider horizontal inverted>Or</Divider>
                    <FacebookLogin
                        appId='487386143777579'
                        onSuccess={(response: SuccessResponse) => {
                            userStore.facebookLogin(response.accessToken);
                            // console.log('login success', response);
                        }}
                        onFail={(response: FailResponse) => {
                            console.log('Login failed!', response);
                        }}
                        className={`ui button facebook huge inverted ${userStore.fbLoading && 'loading'}`}
                        />
                </>
            )}

        </Container>
    </Segment>
}
export default observer(HomePage);