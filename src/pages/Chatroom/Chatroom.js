import React, { useEffect, useContext } from 'react';
import {Preloader} from "../../components/UI/preloader";
import { fetchChat, setActiveUser } from '../../redux/actions/eventsActions';
import { connect } from 'react-redux';
import siteSettingsContext from "../../context/siteSettingsContext";
import './chatroom.scss';
import ChatBox from "../../components/ChatBox/ChatBox";

function Chatroom({params, fetchChat, setActiveUser, loading, chat, chatError}) {
    const { translate } = useContext(siteSettingsContext);

    useEffect(() => {
        fetchChat(params.chatID);
    }, []);

    return (
        <div className="chatroom">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-video"/>
                        { translate('videochat') }
                    </h2>
                </div>
                <div className="widget">
                    {
                        loading || ( !chatError && !chat ) ?
                            <Preloader/>
                            :
                            chatError ?
                                <div className="chatroom__error">{ chatError }</div>
                                :
                                <ChatBox setActiveUser={setActiveUser} chat={chat} />
                    }
                </div>
                {/*<div id="jitsi-container" />*/}
            </section>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.eventsReducer.loading,
        chat: state.eventsReducer.chat,
        chatError: state.eventsReducer.chatError
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChat: (chatID) => dispatch(fetchChat(chatID)),
        setActiveUser: (chatID, newActiveUsers) => dispatch(setActiveUser(chatID, newActiveUsers))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom);
