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

{/*<div className="grid_col col-12 desktop-col-6">*/}

export default function ChatList({events, usersList, loading, mapEventToFormFields, heading}) {
    const { translate } = useContext(SiteSettingsContext);

    return (
        <div className="adminChats widget">
            <h3 className="widget__title">{ heading }</h3>
            <Scrollbars
                autoHeight
                hideTracksWhenNotNeeded
                autoHeightMax={'calc(100vh - 112px - 85px - 65px)'}
                renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                renderView={props => <div {...props} className="scrollbar__content"/>}
            >
                {
                    loading || !events ?
                        <Preloader/>
                        :
                        <div className="adminChats__eventsList">
                            {
                                events.length ?
                                    joinByDate(events).map(block => _renderBlockByDate(block))
                                    :
                                    <div className="nothingFound">
                                        { translate('no_videochats') }
                                    </div>
                            }
                        </div>
                }
            </Scrollbars>
        </div>
    );

    function _renderBlockByDate(block) {
        return (
            <div className={classNames('adminChats__eventsBlock', { isPast: block.date <= moment().unix(), isToday: block.formattedDate === moment().format('DD MMMM YYYY') })} key={block.date}>
                <div className="adminChats__eventsBlock-date">
                    { block.formattedDate }
                </div>
                {
                    orderBy(block.children, v => v.datetime).map(event => <ChatListItem key={event.id} event={event} usersList={usersList} mapEventToFormFields={mapEventToFormFields}/>)
                }
            </div>
        )
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

        return orderBy(newEventsArr, v => -v.date);
    }
}