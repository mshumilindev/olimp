import React, {useCallback, useContext, useMemo, useEffect, useState} from 'react';
import Preloader from "../../components/UI/preloader";
import './journal.scss';
import { connect } from 'react-redux';
import moment from "moment";
import classNames from "classnames";
import siteSettingsContext from "../../context/siteSettingsContext";
import {orderBy} from "natural-orderby";
import {fetchClasses} from "../../redux/actions/classesActions";
import { Link } from 'react-router-dom';

moment.locale('uk');

const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
const daysNames = {
    'пн': 'monday',
    'вт': 'tuesday',
    'ср': 'wednesday',
    'чт': 'thursday',
    'пт': 'friday',
    'сб': 'saturday',
    'нд': 'sunday'
};

const Journal = ({attendance, coursesList, classesList, coursesLoading, classesLoading, user, usersList, events}) => {
  const [currentDayTime, setCurrentDayTime] = useState(moment().format('HH:mm'));
  const [ shift, setShift ] = useState(0);
  const currentClassSchedule = useMemo(() => {
    return classesList?.find((classItem) => classItem.id === user?.class)?.schedule;
  }, [classesList, user]);
  const { lang, translate } = useContext(siteSettingsContext);
  const startOfWeek = useMemo(() => moment().startOf('week').add(shift, 'week').unix(), [shift]);
  const today = useMemo(() => moment().startOf('day').unix(), []);
  const week = useMemo(() => {
    const weekArr = [];

    weekArr.push(startOfWeek);

    for (let i = 1; i < 6; i ++) {
      weekArr.push(weekArr[i - 1] + 86400)
    }

    return weekArr;
  }, [startOfWeek]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDayTime(moment().format('HH:mm'));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const time = ['8:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const getLessonTop = useCallback((day, startTime) => {
    const dayStartToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${time[0]}`).unix();
    const dayEndToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${time[time.length - 1]}`).unix();
    const lessonTimeStartToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${startTime}`).unix()
    const dayLength = dayEndToUnix - dayStartToUnix;
    const currentTime = lessonTimeStartToUnix - dayStartToUnix;

    return `${currentTime * 100 / dayLength}%`;
  }, [time]);

  const getLessonHeight = useCallback((day, {start, end}) => {
    const dayStartToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${time[0]}`).unix();
    const dayEndToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${time[time.length - 1]}`).unix();
    const lessonTimeStartToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${start}`).unix();
    const lessonTimeEndToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${end}`).unix();
    const dayLength = dayEndToUnix - dayStartToUnix;
    const currentTime = lessonTimeEndToUnix - lessonTimeStartToUnix;

    return `${currentTime * 100 / dayLength}%`;
  }, [time]);

  const getAttendance = useCallback((day, lesson) => {
    if ( !attendance ) return {
      attended: null,
      mark: null
    };

    const formattedDay = moment(day * 1000).format('DD_MMMM_YYYY');
    const foundAttDay = attendance.find((item) => item.day === formattedDay);

    if ( !foundAttDay ) return {attended: false};

    const foundAttItem = foundAttDay.courses.find((course) => course.course === lesson.course && course.start === lesson.time.start);

    if ( !foundAttItem ) return {attended: false};

    return {attended: true, mark: foundAttItem.mark};
  }, [attendance]);

  const getIsCurrentLesson = useCallback((day, {start, end}) => {
    const lessonTimeStartToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${start}`).unix();
    const lessonTimeEndToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${end}`).unix();
    const currentDayTimeToUnix = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${currentDayTime}`).unix();

    return day === today && currentDayTimeToUnix >= lessonTimeStartToUnix && currentDayTimeToUnix <= lessonTimeEndToUnix;
  }, [currentDayTime, today]);

  return (
    <div className="journal-holder">
      <div className="journal">
        <div className="journal__days">
          <div className="journal__prev" onClick={() => setShift(shift - 1)}>
            <i class="fa-solid fa-chevron-left" />
          </div>
          <div className="journal__next" onClick={() => setShift(shift + 1)}>
            <i class="fa-solid fa-chevron-right" />
          </div>
          <div className="journal__day first" />
          {
            week.map((day) => {
              const currentLessons = currentClassSchedule?.[moment.unix(day).weekday()]?.lessons;

              return (
                <div className={`journal__day${day === today ? ' active' : ''}${!currentLessons?.length ? ' isHoliday' : ''}`} key={day}>
                  <span>
                    {day === today && `${translate('today')}: `}
                    {translate(daysNames[daysOfWeek[moment.unix(day).weekday()]])}
                  </span>
                  <span className="journal__day-date"><strong>{moment.unix(day).format('DD MMM')}</strong> {moment.unix(day).format('YYYY')}</span>
                </div>
              )
            })
          }
        </div>
        <div className="journal__schedule">
          <div className="journal__timeSlot-holder">
            {
              time.map((timeSlot) => {
                return (
                  <div className="journal__timeSlot" key={timeSlot}>
                    {timeSlot}
                  </div>
                )
              })
            }
          </div>
          <div className="journal__currentTime-holder">
            <div className="journal__currentTime" style={{top: getLessonTop(today, currentDayTime)}} />
          </div>
          {
            week.map((day) => {
              const currentLessons = currentClassSchedule?.[moment.unix(day).weekday()]?.lessons;

              return (
                <div className={`journal__lessons${day === today ? ' isToday' : ''}`} key={day}>
                  {
                    currentLessons?.map((lesson) => {
                      const currentLessonDateTime = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${lesson.time.start}`).unix();
                      const currentSubject = coursesList?.find((subject) => subject.id === lesson.subject);
                      const currentCourse = currentSubject?.coursesList?.find((course) => course.id === lesson.course);
                      const currentSubjectName = currentSubject?.name?.[lang] || currentSubject?.name?.['ua'] || '';
                      const currentCourseName = currentCourse?.name?.[lang] || currentCourse?.name?.['ua'] || '';
                      const teacher = usersList?.find((user) => user.id === currentCourse?.teacher);
                      const { attended, mark } = getAttendance(day, lesson);
                      const timeNow = moment().unix();
                      const lessonTimeEnd = moment(`${moment(day * 1000).format('MM/DD/YYYY')} ${lesson.time.end}`).unix();
                      const timePassed = timeNow >= lessonTimeEnd;
                      const chat = events?.participant?.find((chat) => chat.datetime === currentLessonDateTime && chat.organizer === teacher?.id);

                      return (
                        <div className={`journal__lessons-item${timePassed ? attended ? ' attended' : ' skipped' : ''}${getIsCurrentLesson(day, lesson.time) ? ' isCurrent' : ''}`} key={`${lesson.testsubject1}_${lesson.time.start}_${lesson.time.end}`} style={{top: getLessonTop(day, lesson.time.start), height: getLessonHeight(day, lesson.time)}}>
                          <div className="journal__lessons-time">{`${lesson.time.start} • ${lesson.time.end}`}</div>
                          <div className="journal__lessons-name">
                            <strong>
                              {
                                !!chat ?
                                  <Link to={`/chat/${chat.id}`}><i className="fas fa-video"/><b>{ currentSubjectName }</b></Link>
                                  :
                                  (
                                    <>
                                      <i className="fa fa-graduation-cap"/>
                                      <b>{ currentSubjectName }</b>
                                    </>
                                  )
                              }
                            </strong>
                            {
                              !!chat?.lesson?.lessonName && (
                                <span><b>{translate('lesson')}</b>: <Link to={`/courses/${chat.lesson.subjectID}/${chat.lesson.courseID}/${chat.lesson.moduleID}/${chat.lesson.lessonID}`}>{chat.lesson.lessonName}</Link></span>
                              )
                            }
                          </div>
                          {
                            !!teacher && (
                              <div className="journal__lessons-teacher">
                                <span>{translate('teacher')}: </span>
                                <Link to={`/user/${teacher.login}`}><strong>{ teacher.name }</strong></Link>
                              </div>
                            )
                          }
                          {
                            attended ?
                              !!mark ?
                                <div className="journal__lessons-mark">{ `${translate('mark')}: ` }<strong>{mark}</strong></div>
                                :
                                null
                              :
                              <div className="journal__lessons-skipped">{ timePassed && 'Пропуск' }</div>
                          }
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
};


const mapStateToProps = state => {
  return {
    classesList: state.classesReducer.classesList,
    classesLoading: state.classesReducer.loading,
    coursesLoading: state.coursesReducer.loading,
    coursesList: state.coursesReducer.coursesList,
    usersList: state.usersReducer.usersList,
    events: state.eventsReducer.events,
  }
};

const mapDispatchToProps = dispatch => ({
    fetchClasses: dispatch(fetchClasses()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
