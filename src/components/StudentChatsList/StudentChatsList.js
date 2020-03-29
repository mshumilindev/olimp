import React, {useContext} from 'react';
import {Preloader} from "../UI/preloader";
import moment from "moment";
import {orderBy} from "natural-orderby";
import classNames from "classnames";
import ChatListItem from "../ChatList/ChatListItem";
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import '../../pages/AdminChats/adminChats.scss';

function StudentChatsList({ events, loading, usersList, showTodayOnly }) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <>
            {
                showTodayOnly ?
                    <div className="block__heading">
                        <i className="content_title-icon fas fa-video"/>
                        { translate('chats_today') }
                    </div>
                    :
                    null
            }
            {
                loading ?
                    <Preloader/>
                    :
                    joinByDate(splitEvents().oneTime).length ?
                        joinByDate(splitEvents().oneTime).map(block => _renderBlockByDate(block))
                        :
                        <div className="nothingFound">
                            {translate('no_videochats_yet')}
                        </div>
            }
        </>
    );

    function joinByDate(eventsArr) {
        const newEventsArr = [];

        eventsArr.forEach(event => {
            const formattedDate = moment(event.datetime * 1000).format('DD MMMM YYYY');

            if ( !newEventsArr.find(item => item.formattedDate === formattedDate) ) {
                newEventsArr.push({
                    formattedDate: formattedDate,
                    date: event.datetime,
                    children: []
                });
            }
            newEventsArr.find(item => item.formattedDate === formattedDate).children.push(event);
        });

        return orderBy(newEventsArr.filter(block => showTodayOnly ? block.formattedDate === moment().format('DD MMMM YYYY') : true).filter(block => block.date > moment().unix()), v => v.date);
    }

    function splitEvents() {
        const newEvents = {};

        newEvents.reccuring = events.filter(event => event.reccuring);
        newEvents.oneTime = events.filter(event => !event.reccuring);

        return newEvents;
    }

    function _renderBlockByDate(block) {
        return (
            <div className={classNames('adminChats__eventsBlock', { isToday: block.formattedDate === moment().format('DD MMMM YYYY') })} key={block.date}>
                {
                    !showTodayOnly ?
                        <div className="adminChats__eventsBlock-date">
                            { block.formattedDate }
                        </div>
                        :
                        null
                }
                { orderBy(block.children, v => v.datetime).map(event => <ChatListItem key={event.id} event={event} usersList={usersList} noActions/>) }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.eventsReducer.loading,
        events: state.eventsReducer.events,
        usersList: state.usersReducer.usersList
    }
};

export default connect(mapStateToProps, null)(StudentChatsList);