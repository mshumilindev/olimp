import React, { Fragment } from 'react';
import {Provider} from "react-redux";
import {scheduleStore} from "../../redux/stores/scheduleStore";
import ScheduleContainer from "../../containers/scheduleContainer";
import siteSettingsContext from "../../context/siteSettingsContext";
import EventsCalendar from '../../components/EventsCalendar/EventsCalendar';
import EventsCalendarContainer from '../../containers/EventsCalendarContainer';

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
                        {/*    <Provider store={scheduleStore}>*/}
                        {/*        <ScheduleContainer prefix="schedule--" />*/}
                        {/*    </Provider>*/}
                        {/*</section>*/}
                        <section className="section">
                            <Provider store={scheduleStore}>
                                <EventsCalendarContainer />
                            </Provider>
                        </section>
                    </div>
                </div>
            </Fragment>
        )
    }
}
Schedule.contextType = siteSettingsContext;