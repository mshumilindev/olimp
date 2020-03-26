import React, { useContext, useState } from 'react';
import userContext from "../../context/userContext";
import siteSettingsContext from "../../context/siteSettingsContext";
import Fullscreen from 'react-full-screen';
import ChatContainer from "./ChatContainer";

export default function ChatBox({setActiveUser, chat, users, setChatStart, setStopChat, removeActiveUser}) {
    const { user } = useContext(userContext);
    const { translate } = useContext(siteSettingsContext);
    const [ isFullScreen, setIsFullScreen ] = useState(false);

    return (
        <div className="chatroom__chatBox">
            {
                users && user.role !== 'student' ?
                    <div className="chatroom__users">
                        {
                            _renderUserItem(
                                getOrganizerClasses(),
                                users.find(userItem => userItem.id === chat.organizer)
                            )
                        }
                        {
                            users
                                .filter(userItem => userItem.id !== chat.organizer)
                                .filter(userItem => chat.activeUsers && chat.activeUsers.length && chat.activeUsers.find(activeItem => activeItem.name === userItem.name))
                                .map(userItem => _renderUserItem('activeUser', userItem))
                        }
                        {
                            users
                                .filter(userItem => userItem.id !== chat.organizer)
                                .filter(userItem => !chat.activeUsers || !chat.activeUsers.length || !chat.activeUsers.find(activeItem => activeItem.name === userItem.name))
                                .map(userItem => _renderUserItem('inactiveUser', userItem))
                        }
                    </div>
                    :
                    null

            }
            {
                chat.started ?
                    <Fullscreen enabled={isFullScreen}>
                        <div className={isFullScreen ? 'chatroom__chatHolder fullscreen' : 'chatroom__chatHolder'}>
                            {
                                chat.started ?
                                    <ChatContainer setActiveUser={setActiveUser} removeActiveUser={removeActiveUser} chat={chat}/>
                                    :
                                    null
                            }
                            <div className="chatroom__btnsHolder">
                                <span className="btn btn_primary round" onClick={() => setIsFullScreen(!isFullScreen)}><i className="fas fa-compress" /></span>
                                {
                                    user.id === chat.organizer ?
                                        <span className="btn btn__error round" onClick={stopChat}><i className="fas fa-phone-slash" /></span>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </Fullscreen>
                    :
                    user.id === chat.organizer ?
                        <div className="chatroom__btnsHolder">
                            <span className="btn btn__success round" onClick={startChat}><i className="fas fa-phone" /></span>
                        </div>
                        :
                        <div className="chatroom__info">{ translate('chat_will_start_soon') }</div>
            }
        </div>
    );

    function _renderUserItem(type, userItem) {
        return (
            <div className={'chatroom__users-item ' + type} key={userItem.id}>
                <div className="chatroom__users-item-avatar-holder">
                    {
                        userItem.avatar ?
                            <div className="chatroom__users-item-avatar" style={{ backgroundImage: 'url(' + userItem.avatar + ')' }} />
                            :
                            <i className="chatroom__users-item-avatar-placeholder fa fa-user"/>
                    }
                </div>
                <div className="chatroom__users-item-name" dangerouslySetInnerHTML={{__html: userItem.name.split(' ').join('<br/>')}} />
            </div>
        );
    }

    function startChat() {
        setChatStart(chat.id, true);
    }

    function stopChat() {
        setStopChat(chat.id, chat.activeUsers);
    }

    function getOrganizerClasses() {
        let classes = 'organizer';

        if (
            chat.activeUsers &&
            chat.activeUsers.length &&
            chat.activeUsers.find(activeItem => {
                return activeItem.name === users.find(userItem => userItem.id === chat.organizer).name
            })
        ) {
            classes += ' activeUser';
        }
        else {
            classes += ' inactiveUser';
        }
        return classes;
    }
}
