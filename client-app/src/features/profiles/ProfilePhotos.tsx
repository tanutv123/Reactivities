import {observer} from "mobx-react-lite";
import {Button, Card, Grid, Header, Image, TabPane} from "semantic-ui-react";
import {Photo, Profile} from "../../app/models/profile.ts";
import {useStore} from "../../app/stores/store.ts";
import {SyntheticEvent, useState} from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget.tsx";

interface Props {
    profile: Profile;
}

function ProfilePhotos({profile} : Props) {
    const {profileStore: {
        isCurrentUser,
        uploading,
        uploadPhoto,
        loading,
        setMainPhoto,
        deletePhoto
    }} = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');
    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return <TabPane>
        <Grid>
            <Grid.Column width={16}>
                <Header icon='image' content='Photos' floated='left'/>
                {isCurrentUser && (
                    <Button
                        floated='right'
                        basic
                        content={addPhotoMode ? 'Cancel' : 'Add photo'}
                        onClick={() => setAddPhotoMode(!addPhotoMode)}
                    />
                )}
            </Grid.Column>
            <Grid.Column width={16}>
                {addPhotoMode ? (
                    <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading}/>
                ) : (
                    <Card.Group itemsPerRow={5}>
                        {profile.photos?.map((photo) =>
                            <Card key={photo.id}>
                                <Image src={photo.url}/>
                                {isCurrentUser && <Button.Group fluid widths={2}>
                                    <Button
                                        basic
                                        color='green'
                                        content='Main'
                                        name={'main' + photo.id}
                                        disabled={photo.isMain}
                                        onClick={e => handleSetMainPhoto(photo, e)}
                                        loading={target === 'main' + photo.id && loading}
                                    />
                                    <Button
                                        basic
                                        color='red'
                                        icon='trash'
                                        loading={target === 'delete' + photo.id && loading}
                                        onClick={e => handleDeletePhoto(photo, e)}
                                        disabled={photo.isMain}
                                        name={'delete' + photo.id}
                                    />
                                </Button.Group>}
                            </Card>
                        )}
                    </Card.Group>
                )}
            </Grid.Column>
        </Grid>

    </TabPane>
}

export default observer(ProfilePhotos);