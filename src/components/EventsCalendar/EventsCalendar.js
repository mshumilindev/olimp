import React from "react";
import siteSettingsContext from "../../context/siteSettingsContext";
import EventsCalendarDate from "./EventsCalendarDate";
import EventsCalendarDay from "./EventsCalendarDay";
import "./eventsCalendar.scss";
import { saveCourse } from "../../redux/actions/scheduleActions";
import withSaveCourse from "../../utils/SaveCourse";
import { connect } from "react-redux";
import moment from "moment";

class EventsCalendar extends React.Component {
  constructor() {
    super();

    this.config = {
      months: {
        1: "january",
        2: "fabruary",
        3: "march",
        4: "april",
        5: "may",
        6: "june",
        7: "july",
        8: "august",
        9: "september",
        10: "october",
        11: "november",
        12: "december",
      },
      days: {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      },
    };

    this.state = {
      calendarMonthsArray: [],
      calendarArray: [],
    };
  }

  componentDidMount() {
    this.buildMonth();
    this.createCalendar();
  }

  // === Needs to be moved out of this component
  createCalendar() {
    const { calendar } = this.props;
    const { firstSemester, secondSemester } = calendar.studyTime;
    const today = this.getCurrentDayNumber(new Date());
    const firstStudyDay = this.getCurrentDayNumber(
      new Date(firstSemester.from + " " + this.currentYear),
    );
    const lastStudyDay = this.getCurrentDayNumber(
      new Date(secondSemester.to + " " + this.currentYear),
    );
    let startYear = this.currentYear;
    const indexArr = [];

    if (today >= lastStudyDay && today < firstStudyDay) {
      startYear--;
      console.log("We are on summer vacation");
    } else {
      if (today > lastStudyDay) {
        startYear--;
        console.log("We are in first semester");
      } else {
        console.log("We are in second semester");
      }
    }
    if (this.daysOfAYear(startYear + 1) === 365) {
      indexArr[364] = "end";
    } else {
      indexArr[365] = "end";
    }

    const calendarArray = [];

    for (let i = 0; i < indexArr.length; i++) {
      const nextDate = new Date(firstSemester.from + " " + startYear).setDate(
        new Date(firstSemester.from + " " + startYear).getDate() + i,
      );
      calendarArray.push(
        this.createDaySchedule(nextDate, startYear, indexArr[i]),
      );

      if (indexArr[i] === "end") {
        this.setState(() => {
          return {
            calendarArray: calendarArray,
          };
        });
      }
    }
  }

  daysOfAYear(year) {
    return this.isLeapYear(year) ? 366 : 365;
  }

  isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  }

  createDaySchedule(date, startYear) {
    const { scheduleList, calendar } = this.props;
    const dateDay = new Date(date).getDay();
    const dateFormatted = moment(date).format("DD MMMM");
    const dateFormattedNumber = moment(date).format("DD");
    let dateFormattedMonth = moment(date).format("MM");
    const dayToSave = {
      date: date,
      daySchedule: null,
    };
    let holidayInfo = null;

    if (getVacation()) {
      dayToSave.daySchedule = "vacation";
    }
    if (getHoliday()) {
      dayToSave.daySchedule = "holiday";
      dayToSave.holiday = holidayInfo;
    }
    if (!dayToSave.daySchedule) {
      dayToSave.daySchedule = scheduleList.find(
        (item) => item.day === this.config.days[dateDay],
      )
        ? scheduleList.find((item) => item.day === this.config.days[dateDay])
        : "weekend";
    }

    return dayToSave;

    function getHoliday() {
      return calendar.leisureTime.holidays.find((holiday) => {
        if (dateDay === 1) {
          const holidayDateNum = parseInt(holiday.date);
          const holidayMonth = holiday.date.replace(
            "" + holidayDateNum + " ",
            "",
          );
          const holidayOneDayAgo = holidayDateNum + 1 + " " + holidayMonth;
          const holidayTwoDaysAgo = holidayDateNum + 2 + " " + holidayMonth;

          if (
            holiday.date === dateFormatted ||
            holidayOneDayAgo === dateFormatted ||
            holidayTwoDaysAgo === dateFormatted
          ) {
            holidayInfo = holiday;
            return true;
          }
        } else {
          if (dateDay > 0 && dateDay < 6 && holiday.date === dateFormatted) {
            holidayInfo = holiday;
            return true;
          }
        }
        return false;
      });
    }

    function getVacation() {
      return Object.keys(calendar.leisureTime.vacations).some((seasonType) => {
        const seasonFrom = moment(
          calendar.leisureTime.vacations[seasonType].from + startYear,
        );
        const seasonFromNumber = seasonFrom.format("DD");
        let seasonFromMonth = seasonFrom.format("MM");

        const seasonTo = moment(
          calendar.leisureTime.vacations[seasonType].to + startYear,
        );
        const seasonToNumber = seasonTo.format("DD");
        let seasonToMonth = seasonTo.format("MM");

        if (+dateFormattedMonth === 1) {
          dateFormattedMonth = 13;
        }
        if (+seasonFromMonth === 1) {
          seasonFromMonth = 13;
        }
        if (+seasonToMonth === 1) {
          seasonToMonth = 13;
        }

        return (
          +(dateFormattedMonth + dateFormattedNumber) >=
            +(seasonFromMonth + seasonFromNumber) &&
          +(dateFormattedMonth + dateFormattedNumber) <=
            +(seasonToMonth + seasonToNumber)
        );
      });
    }
  }

  getCurrentDayNumber(date) {
    const now = new Date(date);
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.floor(diff / oneDay);
  }

  render() {
    const { calendarMonthsArray, calendarArray } = this.state;
    const { translate } = this.context;
    const { getCourseToSave, coursesList } = this.props;

    return (
      <div className="eventsCalendar">
        <div className="eventsCalendar__controls">
          <a href="/" className="eventsCalendar__controls-prev">
            <i className="fa fa-chevron-left" />
          </a>
          <h2 className="eventsCalendar__controls-heading">
            {this.currentMonth + " " + this.currentYear}
          </h2>
          <a href="/" className="eventsCalendar__controls-next">
            <i className="fa fa-chevron-right" />
          </a>
        </div>
        <div className="eventsCalendar__data">
          <div className="eventsCalendar__daysList">
            {Object.keys(this.config.days)
              .filter((key) => key !== "0")
              .map((key) => (
                <EventsCalendarDay
                  day={translate(this.config.days[key])}
                  key={key}
                />
              ))}
            {<EventsCalendarDay day={translate(this.config.days[0])} />}
          </div>
          {calendarMonthsArray.length && calendarArray.length ? (
            <div className="eventsCalendar__datesList">
              {calendarMonthsArray.map((date, index) => {
                return (
                  <EventsCalendarDate
                    date={calendarArray.find(
                      (calItem) =>
                        calItem.date === moment(date.date).unix() * 1000,
                    )}
                    key={index + date.date}
                    isDisabled={date.disabled}
                    getCourseToSave={getCourseToSave}
                    isLastDate={index === calendarMonthsArray.length - 1}
                    coursesList={coursesList}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  buildMonth() {
    const calendarMonthsArray = [];

    // === Getting previous month days
    if (this.firstMonthDay !== 1) {
      for (let i = -this.firstMonthDay + 2; i <= 0; i++) {
        calendarMonthsArray.push({
          disabled: true,
          date: this.createDay(i),
        });
      }
    }

    // === Getting current month days
    for (let i = 0; i < this.lastMonthDate; i++) {
      calendarMonthsArray.push({
        disabled: false,
        date: this.createDay(i + 1),
      });
    }

    // === Getting next month days
    if (this.lastMonthDay !== 0) {
      for (let i = 0; i <= 6 - this.lastMonthDay; i++) {
        calendarMonthsArray.push({
          disabled: true,
          date: this.createDay(i),
        });
      }
    }

    this.setState(() => {
      return {
        calendarMonthsArray: calendarMonthsArray,
      };
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

  get currentMonthNumber() {
    const { months } = this.config;

    return months[new Date().getMonth() + 1];
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

    return date.length === 1 ? "0" + date : date;
  }

  get currentYear() {
    return new Date().getFullYear().toString();
  }
}

EventsCalendar.contextType = siteSettingsContext;

const mapStateToProps = (state) => ({
  scheduleList: state.scheduleReducer.scheduleList,
  coursesList: state.scheduleReducer.coursesList,
  calendar: state.scheduleReducer.calendar,
  loading: state.scheduleReducer.loading,
});
export default connect(mapStateToProps, { saveCourse })(
  withSaveCourse(EventsCalendar),
);
