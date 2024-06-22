import {Button, Header, Segment} from "semantic-ui-react";
import { useEffect, useState} from "react";
import {useStore} from "../../../app/stores/store.ts";
import {observer} from "mobx-react-lite";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Activity} from "../../../app/models/activity.ts";
import LoadingComponent from "../../../app/layout/LoadingComponent.tsx";
import {Formik, Form} from "formik";
import * as Yup from 'yup'
import MyTextInput from "../../../app/common/form/MyTextInput.tsx";
import MyTextArea from "../../../app/common/form/MyTextArea.tsx";
import MySelectInput from "../../../app/common/form/MySelectInput.tsx";
import {categoryOptions} from "../../../app/common/options/categoryOptions.ts";
import MyDateInput from "../../../app/common/form/MyDateInput.tsx";
import {v4 as uuid} from 'uuid'

function ActivityForm() {
    const {activityStore} = useStore();
    const {createActivity,
        updateActivity,
        loading,
        loadActivity,
        loadingInitial} = activityStore;
    const {id} = useParams();
    const [activity, setActivity] =
        useState<Activity>({id: '',
        description: '',
        title: '',
        category: '',
        date: null,
        venue: '',
        city: ''}
        );
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required()
    });
    useEffect(() => {
        if (id) {
            loadActivity(id).then((activity) => {
                setActivity(activity!);
            });
        }
    }, [id, loadActivity]);

    function handleFormSubmit(activity: Activity) {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => {
                navigate('/activities/' + activity.id);
            });
        } else {
            updateActivity(activity).then(() => {
                navigate('/activities/' + activity.id);
            });
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...'/>


    return(
        <Segment clearing>
            <Header content='Activity Details' sub color='teal'/>
            <Formik
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}
                validationSchema={validationSchema}
            >
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder='title' name='title'/>
                        <MyTextArea row={3} placeholder='Description' name='description'/>
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category'/>
                        <MyDateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal'/>
                        <MyTextInput placeholder='City' name='city'/>
                        <MyTextInput placeholder='Venue' name='venue'/>
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit'
                        />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
                    </Form>
                )}
            </Formik>
        </Segment>
    );
}

export default observer(ActivityForm);