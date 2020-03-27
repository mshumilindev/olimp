import React, {useContext, useState} from 'react';
import moment from "moment";
import 'moment/locale/uk';
import SiteSettingsContext from "../../context/siteSettingsContext";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { deleteEvent } from '../../redux/actions/eventsActions';
import Confirm from "../UI/Confirm/Confirm";
moment.locale('uk');

function ChatListItem({event, usersList, classesList, deleteEvent}) {
    const { translate, lang } = useContext(SiteSettingsContext);
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false);

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
                        <Link to={'/admin-users/' + getUser(event.organizer).login}>{ getUser(event.organizer).name }</Link>
                    </div>
                </div>
                <div className="adminChats__event-info-row">
                    <div className="adminChats__event-info-dt">{ translate('participants') }: </div>
                    <div className="adminChats__event-info-dd">
                        {
                            formGroup(event.participants) ?
                                <Link to={formGroup(event.participants).link}>{ formGroup(event.participants).title }</Link>
                                :
                                event.participants.map(partItem => <Link to={'/admin-users/' + getUser(partItem).login} key={partItem}>{ getUser(partItem).name }</Link>)
                        }
                    </div>
                </div>
            </div>
            <div className="adminChats__event-actions">
                <Link to={'/chat/' + event.id} className="btn btn_primary round btn__xs">
                    <i className="fa fa-link" />
                </Link>
                <span className="btn btn_primary round btn__xs">
                    <i className="fa fa-pencil-alt" />
                </span>
                <span className="btn btn__error round btn__xs" onClick={() => setShowConfirmDelete(true)}>
                    <i className="fa fa-trash-alt" />
                </span>
            </div>
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

    function formGroup(list) {
        let group = null;

        // === Check if class
        if ( list.length === list.filter(item => getUser(item).class === getUser(list[0]).class).length ) {
            group = {
                title: classesList.find(item => item.id === getUser(list[0]).class).title[lang],
                link: '/admin-classes/' + getUser(list[0]).class
            };
        }

        return group;
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