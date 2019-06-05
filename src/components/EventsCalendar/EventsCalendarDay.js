import React from 'react';

export default class EventsCalendarDay extends React.PureComponent {
    render() {
        const { day } = this.props;

        return (
            <div className="eventsCalendar__day">
                <div className="eventsCalendar__day-short">
                    { day.short }
                </div>
                <div className="eventsCalendar__day-full">
                    { day.full }
                </div>
            </div>
        )
    }
}
