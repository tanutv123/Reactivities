import {useStore} from "../../app/stores/store.ts";
import useQuery from "../../app/util/hooks.tsx";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent.ts";
import {toast} from "react-toastify";
import {Button, Header, Icon, Segment} from "semantic-ui-react";
import LoginForm from "./LoginForm.tsx";

export default function ConfirmEmail() {
    const {modalStore} = useStore();
    const email = useQuery().get("email") as string;
    const token = useQuery().get("token") as string;

    const Status = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Success: 'Success'
    }


    const [status, setStatus] = useState(Status.Verifying);

    function handleConfirmEmailResend() {
        agent.Account.resendEmailConfirm(email).then(() => {
            toast.success('Verification email sent - please check your email')
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        agent.Account.verifyEmail(email, token).then(() => {
            setStatus(Status.Success);
            toast.success("Verify success - please login with your account")
        }).catch(_ => setStatus(Status.Failed));
    }, [Status.Failed, Status.Success, token, email]);

    function getBody() {
        switch (status) {
            case Status.Verifying:
                return <p>Verifying...</p>;
            case Status.Failed:
                return <div>
                    <p>Vefication failed. You can try resending the verify link to your email</p>
                    <Button primary onClick={handleConfirmEmailResend} size='huge' content='Resend email'/>
                </div>
            case Status.Success:
                return <div>
                    <p>Email has been verified - you can now login</p>
                    <Button primary onClick={() => modalStore.openModal(<LoginForm/>)} content='Login' size='huge'/>
                </div>
        }
    }
    return <Segment placeholder textAlign='center'>
        <Header icon>
            <Icon name='envelope'/>
            Email verification
        </Header>
        <Segment.Inline>
            {getBody()}
        </Segment.Inline>
    </Segment>
}