import React from "react";

export default class EventsCalendarDay extends React.PureComponent {
  render() {
    const { day } = this.props;

    return <div className="eventsCalendar__day">{day}</div>;
  }
}
