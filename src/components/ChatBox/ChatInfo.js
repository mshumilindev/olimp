import React, {useContext, useEffect, useState} from 'react';
import moment from "moment";
import classNames from 'classnames';
import TextTooltip from "../UI/TextTooltip/TextTooltip";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function ChatInfo({isStatic, chat}) {
    const timerMultiplier = 60;

    const { translate } = useContext(siteSettingsContext);
    const [ chatCount, setChatCount ] = useState(0);
    const [ connection, setConnection ] = useState(null);
    const [ chatTimer, setChatTimer ] = useState(null);

    useEffect(() => {
        if ( chat ) {
            if ( chat.started ) {
                setChatTimer(setInterval(() => {
                    setChatCount(moment().unix() - chat.started);
                }, 1000));
            }
            else {
                clearInterval(chatTimer);
                setChatTimer(null);
                setChatCount(0);
            }
        }
    }, [chat]);

    useEffect(() => {
        calcConnection();
        if ( navigator.connection ) {
            navigator.connection.onchange = () => calcConnection();
        }
    }, []);

    return (
        <div className="chatroom__title" style={isStatic ? {position: 'static', marginBottom: 30, marginTop: -15} : null}>
            <div className="chatroom__title-inner">
                {
                    connection ?
                        <TextTooltip text={translate(connection === 'good' ? 'good_connection' : connection === 'medium' ? 'medium_connection' : connection === 'bad' ? 'bad_connection' : 'offline_connection')} children={
                            <div className={classNames('chatroom__connection', {good: connection === 'good', medium: connection === 'medium', bad: connection === 'bad', offline: connection === 'offline'})}>
                                {
                                    connection === 'offline' ?
                                        <span className="offlineAnimation"><i className="fas fa-signal" /></span>
                                        :
                                        null
                                }
                                <i className="fas fa-signal" />
                            </div>
                        }/>
                        :
                        null
                }
                <span className="chatroom__title-text" title={chat.name}>
                    { chat.name }
                </span>
            </div>
            {
                chatCount > 0 ?
                    <div className="chatroom__timer">
                        { makeChatCount() }
                    </div>
                    :
                    null
            }
        </div>
    );

    function calcConnection() {
        if ( navigator.connection ) {
            if ( navigator.connection.downlink > 0 ) {
                if ( navigator.connection.rtt < 200 ) {
                    if ( connection !== 'good' ) {
                        setConnection('good');
                    }
                }
                else if ( navigator.connection.rtt > 200 && navigator.connection.rtt < 1000 ) {
                    if ( connection !== 'medium' ) {
                        setConnection('medium');
                    }
                }
                else {
                    if ( connection !== 'bad' ) {
                        setConnection('bad');
                    }
                }
            }
            else {
                setConnection('offline');
            }
        }
    }

    function makeChatCount() {
        return makeMinutes() + ':' + makeSeconds();
    }

    function makeMinutes() {
        return chatCount / timerMultiplier < 10 ? '0' +  Math.floor((chatCount / timerMultiplier)) : Math.floor(chatCount / timerMultiplier);
    }

    function makeSeconds() {
        return ('' + chatCount % timerMultiplier).length === 1 ? '0' + (chatCount % timerMultiplier) : chatCount % timerMultiplier;
    }
}