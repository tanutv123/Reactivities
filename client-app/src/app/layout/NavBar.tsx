import {Button, Container, Dropdown, Image, Menu} from "semantic-ui-react";
import {Link, NavLink} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useStore} from "../stores/store.ts";

export default observer(function NavBar() {
    const {userStore: {user, logout, isLoggedIn}} = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                {isLoggedIn &&
                    <>
                        <Menu.Item as={NavLink} to='/activities' name='Activities'/>
                        <Menu.Item as={NavLink} to='/errors' name='Errors'/>
                        <Menu.Item name='Activities'>
                            <Button as={NavLink} to='/createActivity' positive content='Create Activity'/>
                        </Menu.Item>
                        <Menu.Item position='right'>
                            <Image avatar spaced='right' src={user?.image || '/assets/user.png'} />
                            <Dropdown pointing='top left' text={user?.displayName}>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text='My Profile' icon='user' />
                                    <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </>
                }
            </Container>
        </Menu>
    );
});