import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import EventsCalendarDate from "./EventsCalendarDate";
import EventsCalendarDay from './EventsCalendarDay';
import './eventsCalendar.scss';
import {saveCourse} from "../../redux/actions/scheduleActions";
import withSaveCourse from '../../utils/SaveCourse';
import {connect} from "react-redux";

class EventsCalendar extends React.Component {
    constructor() {
        super();

        this.config = {
            months: {
                1: 'january',
                2: 'fabruary',
                3: 'march',
                4: 'april',
                5: 'may',
                6: 'june',
                7: 'july',
                8: 'august',
                9: 'september',
                10: 'october',
                11: 'november',
                12: 'december'
            },
            days: {
                0: 'sunday',
                1: 'monday',
                2: 'tuesday',
                3: 'wednesday',
                4: 'thursday',
                5: 'friday',
                6: 'saturday'
            }
        };

        this.state = {
            calendarMonthsArray: []
        }
    }

    componentDidMount() {
        this.buildMonth();
        this.createCalendar()
    }

    // === Needs to be moved out of this component
    createCalendar() {
        const { scheduleList, calendar } = this.props;

        console.log(scheduleList, calendar);
    }

    render() {
        const { calendarMonthsArray } = this.state;
        const { translate } = this.context;
        const { scheduleList, getCourseToSave, coursesList } = this.props;

        return (
            <div className="eventsCalendar">
                <div className="eventsCalendar__controls">
                    <a href="/" className="eventsCalendar__controls-prev">
                        <i className="fa fa-chevron-left" />
                    </a>
                    <h2 className="eventsCalendar__controls-heading">{ this.currentMonth + ' ' + this.currentYear }</h2>
                    <a href="/" className="eventsCalendar__controls-next">
                        <i className="fa fa-chevron-right" />
                    </a>
                </div>
                <div className="eventsCalendar__data">
                    <div className="eventsCalendar__daysList">
                        {
                            Object.keys(this.config.days).filter(key => key !== '0').map(key => <EventsCalendarDay day={translate(this.config.days[key])} key={key}/>)
                        }
                        {
                            <EventsCalendarDay day={translate(this.config.days[0])}/>
                        }
                    </div>
                    {
                        calendarMonthsArray.length ?
                            <div className="eventsCalendar__datesList">
                                {
                                    calendarMonthsArray.map((date, index) => <EventsCalendarDate getCourseToSave={getCourseToSave} key={date.date} date={date} daySchedule={scheduleList[new Date(date.date).getDay() - 1]} isLastDate={index === calendarMonthsArray.length - 1} coursesList={coursesList}/>)
                                }
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        )
    }

    buildMonth() {
        const calendarMonthsArray = [];

        // === Getting previous month days
        if ( this.firstMonthDay !== 1 ) {
            for ( let i = -this.firstMonthDay + 2; i <= 0; i++ ) {
                calendarMonthsArray.push({
                    disabled: true,
                    date: this.createDay(i)
                });
            }
        }

        // === Getting current month days
        for ( let i = 0; i < this.lastMonthDate; i++ ) {
            calendarMonthsArray.push({
                disabled: false,
                date: this.createDay(i + 1)
            });
        }

        // === Getting next month days
        if ( this.lastMonthDay !== 0 ) {
            for ( let i = 0; i <= 6 -this.lastMonthDay; i++ ) {
                calendarMonthsArray.push({
                    disabled: true,
                    date: this.createDay(i)
                });
            }
        }

        this.setState(() => {
            return {
                calendarMonthsArray: calendarMonthsArray
            }
        });
    }

    createDay(i) {
        return new Date(+this.currentYear, new Date().getMonth(), i);
    }

    get currentMonth() {
        const { months } = this.config;
        const { translate } = this.context;

        return translate(months[new Date().getMonth() + 1]);
    }

    get firstMonthDay() {
        return new Date(+this.currentYear, new Date().getMonth(), 1).getDay();
    }

    get firstMonthDate() {
        return new Date(+this.currentYear, new Date().getMonth(), 1).getDate();
    }

    get lastMonthDay() {
        return new Date(+this.currentYear, new Date().getMonth() + 1, 0).getDay();
    }

    get lastMonthDate() {
        return new Date(+this.currentYear, new Date().getMonth() + 1, 0).getDate();
    }

    get currentDay() {
        const { days } = this.config;
        const { lang } = this.context;

        return days[lang][new Date().getDay()];
    }

    get currentDate() {
        const date = new Date().getDate().toString();

        return date.length === 1 ? '0' + date : date;
    }

    get currentYear() {
        return new Date().getFullYear().toString();
    }
}

EventsCalendar.contextType = siteSettingsContext;

const mapStateToProps = state => ({
    scheduleList: state.scheduleReducer.scheduleList,
    coursesList: state.scheduleReducer.coursesList,
    calendar: state.scheduleReducer.calendar,
    loading: state.scheduleReducer.loading
});
export default connect(mapStateToProps, { saveCourse })(withSaveCourse(EventsCalendar));
