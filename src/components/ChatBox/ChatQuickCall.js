import React, {useContext, useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import './quickCall.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import ringing from '../../sounds/ringing.mp3';

export default function ChatQuickCall({events, usersList}) {
    const { translate } = useContext(siteSettingsContext);
    const [ callStarted, setCallStarted ] = useState(null);
    const [ caller, setCaller ] = useState(null);

    useEffect(() => {
        if ( events ) {
            setCallStarted(events.find(eventItem => eventItem.started === true));
        }
    }, [events]);

    useEffect(() => {
        if ( callStarted && usersList ) {
            setCaller(usersList.find(item => item.id === callStarted.organizer));
        }
    }, [callStarted, usersList]);

    if ( callStarted ) {
        return (
            <div className="quickCall">
                <div className="quickCall__overlay"/>
                <div className="quickCall__info">
                    {
                        caller ?
                            <span>{ caller.name } { translate('is_calling') }</span>
                            :
                            null
                    }
                    <Link to={'/chat/' + callStarted.id} className="btn btn__success round ringing">
                        <div className="btn__before"/>
                        <i className="fas fa-phone"/>
                    </Link>
                </div>
                <audio autoPlay={true} loop={true}>
                    <source src={ringing}/>
                </audio>
            </div>
        );
    }
    return null;
}
