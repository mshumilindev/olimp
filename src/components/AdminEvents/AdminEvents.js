import React, { useContext } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from 'react-redux';
import {fetchEvents} from "../../redux/actions/eventsActions";

function AdminEvents({ events }) {
    const { translate } = useContext(siteSettingsContext);

    console.log(events);

    return (
        <div className="AdminEvents widget">
            <div className="widget__title">
                <i className="content_title-icon far fa-calendar-alt"/>
                {
                    translate('events')
                }
            </div>
            This is events
        </div>
    )
}

const mapStateToProps = state => ({
    loading: state.eventsReducer.loading,
    events: state.eventsReducer.events
});

const mapDispatchToProps = dispatch => ({
    fetchEvents: dispatch(fetchEvents())
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminEvents);