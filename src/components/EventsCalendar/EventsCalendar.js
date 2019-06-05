import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import EventsCalendarDate from "./EventsCalendarDate";
import EventsCalendarDay from './EventsCalendarDay';
import './eventsCalendar.scss';

export default class EventsCalendar extends React.Component {
    constructor() {
        super();

        this.config = {
            months: {
                ua: {
                    1: 'Січень',
                    2: 'Лютий',
                    3: 'Березень',
                    4: 'Квітень',
                    5: 'Травень',
                    6: 'Червень',
                    7: 'Липень',
                    8: 'Серпень',
                    9: 'Вересень',
                    10: 'Жовтень',
                    11: 'Листопад',
                    12: 'Грудень'
                },
                ru: {
                    1: 'Январь',
                    2: 'Февраль',
                    3: 'Март',
                    4: 'Апрель',
                    5: 'Май',
                    6: 'Июнь',
                    7: 'Июль',
                    8: 'Август',
                    9: 'Сентябрь',
                    10: 'Октябрь',
                    11: 'Ноябрь',
                    12: 'Декабрь'
                },
                en: {
                    1: 'January',
                    2: 'February',
                    3: 'March',
                    4: 'April',
                    5: 'May',
                    6: 'June',
                    7: 'July',
                    8: 'August',
                    9: 'September',
                    10: 'October',
                    11: 'November',
                    12: 'December'
                }
            },
            days: {
                ua: {
                    0: {
                        short: 'Нд',
                        full: 'Неділя'
                    },
                    1: {
                        short: 'Пн',
                        full: 'Понеділок'
                    },
                    2: {
                        short: 'Вт',
                        full: 'Вівторок'
                    },
                    3: {
                        short: 'Ср',
                        full: 'Середа'
                    },
                    4: {
                        short: 'Чт',
                        full: 'Четвер'
                    },
                    5: {
                        short: 'Пт',
                        full: 'П\'ятниця'
                    },
                    6: {
                        short: 'Сб',
                        full: 'Субота'
                    }
                },
                ru: {
                    0: {
                        short: 'Вс',
                        full: 'Воскресенье'
                    },
                    1: {
                        short: 'Пн',
                        full: 'Понедельник'
                    },
                    2: {
                        short: 'Вт',
                        full: 'Вторник'
                    },
                    3: {
                        short: 'Ср',
                        full: 'Среда'
                    },
                    4: {
                        short: 'Чт',
                        full: 'Четверг'
                    },
                    5: {
                        short: 'Пт',
                        full: 'Пятница'
                    },
                    6: {
                        short: 'Сб',
                        full: 'Суббота'
                    }
                },
                en: {
                    0: {
                        short: 'Sun',
                        full: 'Sunday'
                    },
                    1: {
                        short: 'Mon',
                        full: 'Monday'
                    },
                    2: {
                        short: 'Tue',
                        full: 'Tuesday'
                    },
                    3: {
                        short: 'Wed',
                        full: 'Wednesday'
                    },
                    4: {
                        short: 'Thu',
                        full: 'Thursday'
                    },
                    5: {
                        short: 'Fri',
                        full: 'Friday'
                    },
                    6: {
                        short: 'Sat',
                        full: ''
                    }
                }
            }
        };

        this.state = {
            calendarMonthsArray: []
        }
    }

    componentDidMount() {
        this.buildCalendar();
    }

    render() {
        const { calendarMonthsArray } = this.state;
        const { lang } = this.context;
        const { scheduleList } = this.props;

        return (
            <div className="eventsCalendar">
                {
                    this.config.days[lang] ?
                        <div className="eventsCalendar__daysList">
                            {
                                Object.keys(this.config.days[lang]).filter(key => key !== '0').map(key => <EventsCalendarDay day={this.config.days[lang][key]} key={key}/>)
                            }
                            {
                                <EventsCalendarDay day={this.config.days[lang][0]}/>
                            }
                        </div>
                        :
                        null
                }
                {
                    calendarMonthsArray.length ?
                        <div className="eventsCalendar__datesList">
                            {
                                calendarMonthsArray.map(date => <EventsCalendarDate key={date.date} date={date} daySchedule={scheduleList[new Date(date.date).getDay() - 1]}/>)
                            }
                        </div>
                        :
                        null
                }
            </div>
        )
    }

    buildCalendar() {
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
        const newDay = new Date(+this.currentYear, new Date().getMonth(), i);
        return newDay;
    }

    get currentMonth() {
        const { months } = this.config;
        const { lang } = this.context;

        return months[lang][new Date().getMonth() + 1];
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