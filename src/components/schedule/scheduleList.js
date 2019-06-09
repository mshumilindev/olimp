import React, {useContext} from 'react';
import {connect} from "react-redux";
import './scheduleList.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import ScheduleItem from './scheduleItem';
import {Preloader} from "../UI/preloader";
import withSaveCourse from "../../utils/SaveCourse";
import {saveCourse} from "../../redux/actions/scheduleActions";

const ScheduleList = React.memo(({prefix = '', current, scheduleList, levelCoursesList, coursesList, getCourseToSave, loading}) => {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className={prefix + 'scheduleList'}>
            {
                scheduleList.length ?
                    filterSchedule(scheduleList).map((day, index) => _renderDay(day, index === filterSchedule(scheduleList).length - 1))
                    :
                    <Preloader size={50}/>
            }
        </div>
    );

    function _renderDay(day, isLastDate) {
        return (
            <div className={prefix + 'scheduleList_day'} key={day.day}>
                <div className={prefix + 'scheduleList_day-inner'}>
                    <h2 className={prefix + 'scheduleList_title'}>{ translate(day.day) }</h2>
                    <div className={prefix + 'scheduleList_classes'}>
                        {
                            loading ?
                                <Preloader size={50} key={day.day}/>
                                :
                                day.classes.length && levelCoursesList.length ?
                                    day.classes.map((item) => _renderClass(item, isLastDate))
                                    :
                                    _renderEmptyClasses(isLastDate)
                        }
                    </div>
                </div>
            </div>
        )
    }

    function _renderEmptyClasses(isLastDate) {
        return <ScheduleItem isNoClasses getCourseToSave={getCourseToSave} isLast={isLastDate} />
    }

    function _renderClass(item, isLastDate) {
        const courseID = levelCoursesList.find(levelCourse => Object.keys(levelCourse)[0] === item.subject)[item.subject];

        return (
            <ScheduleItem
                key={item.id}
                prefix={prefix}
                course={coursesList.find(item => item.id === courseID)}
                subject={item.subject}
                courseID={courseID}
                isLast={isLastDate}
                getCourseToSave={getCourseToSave}
            />
        )
    }

    function filterSchedule(schedule) {
        let filteredSchedule = [];

        if ( current ) {
            let currentDay = new Date().getDay();
            currentDay = currentDay < 6 && currentDay > 0 ? currentDay : 1;
            const nextDay = currentDay < 5 ? currentDay + 1 : 1;
            const daysArray = {
                1: 'monday',
                2: 'tuesday',
                3: 'wednesday',
                4: 'thursday',
                5: 'friday',
                6: 'saturday',
                7: 'sunday'
            };

            filteredSchedule.push(schedule.find(item => item.day === daysArray[currentDay]));
            filteredSchedule.push(schedule.find(item => item.day === daysArray[nextDay]));
            return filteredSchedule;
        }
        return schedule;
    }
});

const mapStateToProps = state => ({
    scheduleList: state.scheduleReducer.scheduleList,
    levelCoursesList: state.scheduleReducer.levelCoursesList,
    coursesList: state.scheduleReducer.coursesList,
    loading: state.scheduleReducer.loading
});

export default connect(mapStateToProps, { saveCourse })(withSaveCourse(ScheduleList));
