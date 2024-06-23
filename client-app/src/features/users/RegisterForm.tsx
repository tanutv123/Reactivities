import {ErrorMessage, Form, Formik} from "formik";
import MyTextInput from "../../app/common/form/MyTextInput.tsx";
import {Button, Header} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {useStore} from "../../app/stores/store.ts";
import * as Yup from 'yup';
import ValidationError from "../errors/ValidationError.tsx";

export default observer(function RegisterForm() {
    const {userStore} = useStore();
    return(
        <Formik
            initialValues={{displayName: '', userName: '', email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) =>
                userStore.register(values)
                    .catch((error) => setErrors({error}))
            }
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                userName: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),
            })}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up to Reactivities!' color='teal' textAlign='center'/>
                    <MyTextInput placeholder='Display Name' name='displayName'/>
                    <MyTextInput placeholder='Username' name='userName'/>
                    <MyTextInput placeholder='Email' name='email'/>
                    <MyTextInput type='password' placeholder='Password' name='password'/>
                    <ErrorMessage name='error' render={() =>
                        <ValidationError errors={errors.error as unknown as string[]} />} />
                    <Button
                        loading={isSubmitting}
                        positive
                        content='Register'
                        disabled={!isValid || !dirty || isSubmitting}
                        type='submit'
                        fluid/>
                </Form>
            )}
        </Formik>
    );
});