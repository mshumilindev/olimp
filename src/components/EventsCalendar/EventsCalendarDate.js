import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';

export default class EventsCalendarDate extends React.PureComponent {
    render() {
        const { date, daySchedule } = this.props;
        const formattedDate = moment(date.date).format('DD');
        const dateDay = new Date(date.date).getDay();

        console.log(daySchedule);

        return (
            <div className={classNames('eventsCalendar__date', {isDisabled: date.disabled, isWeekend: dateDay === 6 || dateDay === 0})}>
                <div className="eventsCalendar__date-title">
                    { formattedDate }
                </div>
                <div className="eventsCalendar__date-content">
                    {
                        daySchedule ?
                            daySchedule.classes.length ?
                                daySchedule.classes.map(course => this._renderCourse(course))
                                :
                                <div className="eventsCalendar__date-content-item-empty">PLACEHOLDER Немає уроків</div>
                            :
                            null
                    }
                </div>
            </div>
        )
    }

    _renderCourse(course) {
        return (
            <div className="eventsCalendar__date-content-item" key={course.id}>
                <Link to={'/courses/' + course.subject}>{ course.subject }</Link>
            </div>
        )
    }
}