import { observer } from 'mobx-react-lite'
import {Segment, Header, Comment, Loader} from 'semantic-ui-react'
import {useStore} from "../../../app/stores/store.ts";
import {useEffect} from "react";
import {Link} from "react-router-dom";
import {Formik, Form, Field, FieldProps} from "formik";
import * as yup from 'yup'
import {formatDistanceToNow} from "date-fns";

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({activityId} : Props) {
    const {commentStore} = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }
        return () => {
            commentStore.clearComments();
        }

    }, [commentStore, activityId]);



    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Formik
                    onSubmit={(values, { resetForm }) =>
                        commentStore.addComment(values).then(() => resetForm())}
                    initialValues={{ body: '' }}
                    validationSchema={yup.object({
                        body: yup.string().required()
                    })}
                >
                    {({ isSubmitting, isValid, handleSubmit }) => (
                        <Form className='ui form'>
                            <Field name='body'>
                                {(props: FieldProps) => (
                                    <div style={{ position: 'relative' }}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                                            rows={2}
                                            {...props.field}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && e.shiftKey) {
                                                    return;
                                                }
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    isValid && handleSubmit();
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </Field>
                        </Form>
                    )}
                </Formik>
                <Comment.Group>
                    {commentStore.comments.map(comment => {
                        console.log(comment);
                        return (
                            <Comment key={comment.id}>
                                <Comment.Avatar src={comment.image || '/assets/user.png'} />
                                <Comment.Content>
                                    <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>
                                            <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                        </div>
                                    </Comment.Metadata>
                                    <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                                </Comment.Content>
                            </Comment>
                        )
                    })}

                </Comment.Group>
            </Segment>
        </>

    )
})