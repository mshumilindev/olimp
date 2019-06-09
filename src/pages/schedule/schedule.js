import React, { Fragment } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import EventsCalendar from '../../components/EventsCalendar/EventsCalendar';
import ScheduleList from '../../components/schedule/scheduleList';

export default class Schedule extends React.PureComponent {
    render() {
        const { translate } = this.context;

        return (
            <Fragment>
                <div className="grid_col">
                    <div className="content">
                        {/* THIS TITLE NEEDS TO BE MOVED TO PAGES.JS AND MADE DYNAMIC */}
                        <h2 className="content_title">
                            <i className={'content_title-icon fa fa-calendar-alt'} />
                            { translate('schedule') }
                        </h2>
                        {/*<section className="section">*/}
                        {/*    <ScheduleList prefix="schedule--" />*/}
                        {/*</section>*/}
                        <section className="section">
                            <EventsCalendar />
                        </section>
                    </div>
                </div>
            </Fragment>
        )
    }
}
Schedule.contextType = siteSettingsContext;