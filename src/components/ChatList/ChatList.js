import React, {useContext} from 'react';
import {Preloader} from "../UI/preloader";
import ChatListItem from "./ChatListItem";
import SiteSettingsContext from "../../context/siteSettingsContext";
import moment from "moment";
import 'moment/locale/uk';
import {orderBy} from "natural-orderby";
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';
moment.locale('uk');

export default function ChatList({events, usersList, loading, mapEventToFormFields}) {
    const { translate } = useContext(SiteSettingsContext);

    return (
        <div className="adminChats grid">
            {/*<div className="grid_col col-6">*/}
            {/*    <div className="widget">*/}
            {/*        <h3 className="widget__title">{ translate('recurring_videochats') }</h3>*/}
            {/*        <Scrollbars*/}
            {/*            autoHeight*/}
            {/*            hideTracksWhenNotNeeded*/}
            {/*            autoHeightMax={500}*/}
            {/*            renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}*/}
            {/*            renderView={props => <div {...props} className="scrollbar__content"/>}*/}
            {/*        >*/}
            {/*            {*/}
            {/*                loading ?*/}
            {/*                    <Preloader/>*/}
            {/*                    :*/}
            {/*                    <div className="adminChats__eventsList">*/}
            {/*                        {*/}
            {/*                            splitEvents().reccuring.length ?*/}
            {/*                                joinByCalendar(splitEvents().reccuring).map(event => <ChatListItem key={event.id} event={event} usersList={usersList} mapEventToFormFields={mapEventToFormFields}/>)*/}
            {/*                                :*/}
            {/*                                <div className="nothingFound">*/}
            {/*                                    { translate('no_recurring_videochats_yet') }*/}
            {/*                                </div>*/}
            {/*                        }*/}
            {/*                    </div>*/}
            {/*            }*/}
            {/*        </Scrollbars>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="grid_col col-12 desktop-col-6">
                <div className="widget">
                    <h3 className="widget__title">{ translate('one_time_videochats') }</h3>
                    <Scrollbars
                        autoHeight
                        hideTracksWhenNotNeeded
                        autoHeightMax={'calc(100vh - 112px - 85px - 65px)'}
                        renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                        renderView={props => <div {...props} className="scrollbar__content"/>}
                    >
                        {
                            loading ?
                                <Preloader/>
                                :
                                <div className="adminChats__eventsList">
                                    {
                                        splitEvents().oneTime.length ?
                                            joinByDate(splitEvents().oneTime).map(block => _renderBlockByDate(block))
                                            :
                                            <div className="nothingFound">
                                                { translate('no_one_time_videochats_yet') }
                                            </div>
                                    }
                                </div>
                        }
                    </Scrollbars>
                </div>
            </div>
        </div>
    );

    function _renderBlockByDate(block) {
        return (
            <div className={classNames('adminChats__eventsBlock', { isPast: block.date <= moment().unix(), isToday: block.formattedDate === moment().format('DD MMMM YYYY') })} key={block.date}>
                <div className="adminChats__eventsBlock-date">
                    { block.formattedDate }
                </div>
                {
                    block.children.map(event => <ChatListItem key={event.id} event={event} usersList={usersList} mapEventToFormFields={mapEventToFormFields}/>)
                }
            </div>
        )
    }

    function splitEvents() {
        const newEvents = {};

        newEvents.reccuring = events.filter(event => event.reccuring);
        newEvents.oneTime = events.filter(event => !event.reccuring);

        return newEvents;
    }

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

        return orderBy(newEventsArr, v => v.date);
    }

    function joinByCalendar(eventsArr) {
        return eventsArr;
    }
}