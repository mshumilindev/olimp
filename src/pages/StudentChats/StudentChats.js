import React, { useContext } from 'react';
import { connect } from 'react-redux';
import userContext from '../../context/userContext';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";

function StudentChats({ events, loading }) {
    const { user } = useContext(userContext);
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="studentChats">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fas fa-video" />
                    { translate('videochats') }
                </h2>
            </div>
            <section className="section">
                {
                    loading ?
                        <Preloader/>
                        :
                        filterEvents().length ?
                            null
                            :
                            <div className="nothingFound">
                                { translate('no_videochats_yet') }
                            </div>
                }
            </section>
        </div>
    );

    function filterEvents() {
        return [];
    }
}

const mapStateToProps = state => {
    return {
        loading: state.eventsReducer.loading,
        events: state.eventsReducer.events
    }
};

export default connect(mapStateToProps, null)(StudentChats);