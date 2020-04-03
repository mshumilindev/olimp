import React, {useContext, useState} from 'react';
import moment from "moment";
import 'moment/locale/uk';
import SiteSettingsContext from "../../context/siteSettingsContext";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { deleteEvent } from '../../redux/actions/eventsActions';
import Confirm from "../UI/Confirm/Confirm";
import userContext from "../../context/userContext";
moment.locale('uk');

function ChatListItem({event, usersList, deleteEvent, mapEventToFormFields, noActions, isStudent}) {
    const { translate } = useContext(SiteSettingsContext);
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false);
    const { user } = useContext(userContext);

    return (
        <div className="adminChats__event" key={event.id}>
            <div className="adminChats__event-meta">
                <div className="adminChats__event-time">
                    { moment(event.datetime * 1000).format('HH:mm') }
                </div>
                <div className="adminChats__event-name">
                    { event.name }
                </div>
            </div>
            <div className="adminChats__event-info">
                <div className="adminChats__event-info-row">
                    <div className="adminChats__event-info-dt">{ translate('organizer') }: </div>
                    <div className="adminChats__event-info-dd">
                        <Link to={(isStudent ? '/user/' : '/admin-users/') + getUser(event.organizer).login}>{ getUser(event.organizer).name }</Link>
                    </div>
                </div>
                <div className="adminChats__event-info-row">
                    <div className="adminChats__event-info-dt">{ translate('participants') }: </div>
                    <div className="adminChats__event-info-dd">
                        {
                            typeof event.participants === 'object' ?
                                event.participants.map(partItem => {
                                    if ( getUser(partItem) ) {
                                        return <Link to={(isStudent ? '/user/' : '/admin-users/') + getUser(partItem)} key={partItem}>{ getUser(partItem).name }</Link>;
                                    }
                                    else {
                                        return 'undefined';
                                    }
                                })
                                :
                                getUser(event.participants) ?
                                    <Link to={(isStudent ? '/user/' : '/admin-users/') + getUser(event.participants).login} key={event.participants}>{ getUser(event.participants).name }</Link>
                                    :
                                    null
                        }
                    </div>
                </div>
            </div>
            {
                (!noActions && user.id === event.organizer) || user.role === 'admin' ?
                    <div className="adminChats__event-actions">
                        <Link to={'/chat/' + event.id} className="btn btn_primary round btn__xs">
                            <i className="fa fa-link" />
                        </Link>
                        <span className="btn btn_primary round btn__xs" onClick={() => mapEventToFormFields(event)}>
                            <i className="fa fa-pencil-alt" />
                        </span>
                        <span className="btn btn__error round btn__xs" onClick={() => setShowConfirmDelete(true)}>
                            <i className="fa fa-trash-alt" />
                        </span>
                    </div>
                    :
                    null
            }
            {
                showConfirmDelete ?
                    <Confirm cancelAction={() => setShowConfirmDelete(false)} message={translate('sure_to_delete_videochat')} confirmAction={() => deleteEvent(event.id)}/>
                    :
                    null
            }
        </div>
    );

    function getUser(userID) {
        return usersList.find(item => item.id === userID);
    }
}

const mapStateToProps = state => {
    return {
        classesList: state.classesReducer.classesList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        deleteEvent: (eventID) => dispatch(deleteEvent(eventID))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatListItem);