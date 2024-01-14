import React, { useState } from "react";
import moment from "moment";
import classNames from "classnames";
import EventsCalendarClass from "./EventsCalendarClass";
import { connect } from "react-redux";

const EventsCalendarDate = React.memo(
  ({
    date,
    isDisabled,
    isLastDate,
    levelCoursesList,
    coursesList,
    getCourseToSave,
  }) => {
    let [isDateOpen, toggleDate] = useState(false);
    const formattedDate = moment(date.date);
    const dateDay = new Date(date.date).getDay();
    const $date = React.createRef();

    return (
      <div
        ref={$date}
        className={classNames("eventsCalendar__date", {
          isDisabled: isDisabled,
          isHoliday: date.daySchedule === "holiday",
          isVacation: date.daySchedule === "vacation",
          isWeekend: date.daySchedule === "weekend",
        })}
      >
        <div
          className={classNames("eventsCalendar__date-inner", {
            isDateOpen: isDateOpen,
          })}
        >
          {isDateOpen ? (
            <div
              className="eventsCalendar__date-overflow"
              onClick={() => toggleDate(() => false)}
            />
          ) : null}
          <div className="eventsCalendar__date-block">
            <div className="eventsCalendar__date-title">
              {!isDateOpen
                ? formattedDate.format("DD")
                : formattedDate.format("DD.MM.YYYY")}
              {!date.disabled &&
              date.daySchedule !== "holiday" &&
              date.daySchedule !== "vacation" &&
              date.daySchedule !== "weekend" ? (
                !isDateOpen ? (
                  <i
                    className="eventsCalendar__date-link fa fa-external-link-alt"
                    onClick={() => toggleDate(() => true)}
                  />
                ) : (
                  <i
                    className="eventsCalendar__date-link fas fa-times"
                    onClick={() => toggleDate(() => false)}
                  />
                )
              ) : null}
            </div>
            <div className="eventsCalendar__date-content">
              {_renderClasses()}
            </div>
          </div>
        </div>
      </div>
    );

    function _renderClasses() {
      const { daySchedule } = date;

      return daySchedule === "holiday" ||
        daySchedule === "weekend" ||
        daySchedule === "vacation"
        ? _renderEmptyDate(daySchedule)
        : daySchedule.classes.length && levelCoursesList.length
          ? daySchedule.classes.map((item) => {
              return _renderClass(item);
            })
          : _renderEmptyDate("noClasses");
    }

    function _renderEmptyDate(type) {
      return (
        <EventsCalendarClass
          empty={type}
          getCourseToSave={getCourseToSave}
          isLast={isLastDate}
          holiday={date.holiday}
        />
      );
    }

    function _renderClass(item) {
      const courseID = levelCoursesList.find(
        (levelCourse) => Object.keys(levelCourse)[0] === item.subject,
      )[item.subject];
      const course = coursesList
        ? coursesList.find((item) => item.id === courseID)
        : null;

      return (
        <EventsCalendarClass
          getCourseToSave={getCourseToSave}
          key={item.id}
          subject={item.subject}
          courseID={courseID}
          course={course}
          isLast={isLastDate}
        />
      );
    }
  },
);

const mapStateToProps = (state) => ({
  levelCoursesList: state.scheduleReducer.levelCoursesList,
  loading: state.scheduleReducer.loading,
});
export default connect(mapStateToProps, null)(EventsCalendarDate);
