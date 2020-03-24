import React, { useEffect, useContext } from 'react';
import {Preloader} from "../../components/UI/preloader";
import { fetchChat, setActiveUser } from '../../redux/actions/eventsActions';
import { fetchUsers } from '../../redux/actions/usersActions';
import { connect } from 'react-redux';
import siteSettingsContext from "../../context/siteSettingsContext";
import './chatroom.scss';
import ChatBox from "../../components/ChatBox/ChatBox";
import userContext from "../../context/userContext";
import { orderBy } from 'natural-orderby'

function Chatroom({params, fetchChat, setActiveUser, loading, chat, chatError, users}) {
    const { translate } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);

    useEffect(() => {
        fetchChat(params.chatID, user.id);
    }, []);

    return (
        <div className="chatroom">
            {
                _renderContainer(
                    loading || ( !chatError && !chat ) ?
                    <Preloader/>
                    :
                    chatError ?
                        <div className="chatroom__error">{ translate(chatError) }</div>
                        :
                        <ChatBox setActiveUser={setActiveUser} chat={chat} users={filterUsers()} />
                )
            }
        </div>
    );

    function _renderContainer(children) {
        if ( user.role === 'student' ) {
            return (
                <>
                    <div className="content__title-holder">
                        <h2 className="content__title">
                            <i className="content_title-icon fa fa-video"/>
                            { translate('videochat') }
                        </h2>
                    </div>
                    {
                        children
                    }
                </>
            );
        }
        else {
            return (
                <section className="section">
                    <div className="section__title-holder">
                        <h2 className="section__title">
                            <i className="content_title-icon fa fa-video"/>
                            { translate('videochat') }
                        </h2>
                    </div>
                    <div className="widget">
                        {
                            children
                        }
                    </div>
                </section>
            );
        }
    }

    function filterUsers() {
        if ( chat && users ) {
            const newUsers = [];

            newUsers.push(users.find(userItem => userItem.id === chat.organizer));

            if ( chat.participants.length ) {
                chat.participants.forEach(partItem => newUsers.push(users.find(userItem => userItem.id === partItem)));
            }

            return orderBy(newUsers, v => v.name);
        }
        return null;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.eventsReducer.loading,
        chat: state.eventsReducer.chat,
        chatError: state.eventsReducer.chatError,
        users: state.usersReducer.usersList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChat: (chatID, userID) => dispatch(fetchChat(chatID, userID)),
        setActiveUser: (chatID, newActiveUsers) => dispatch(setActiveUser(chatID, newActiveUsers)),
        fetchUsers: dispatch(fetchUsers())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom);
