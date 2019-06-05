import React  from 'react';
import './scheduleList.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import ScheduleItem from './scheduleItem';
import {Preloader} from "../UI/preloader";

export default class ScheduleList extends React.Component {
    render() {
        const { prefix = '', scheduleList } = this.props;

        return (
            <div className={prefix + 'scheduleList'}>
                {
                    scheduleList.length ?
                        this.filterSchedule(scheduleList).map(day => this._renderDay(day))
                        :
                        <Preloader size={50}/>
                }
            </div>
        )
    }

    _renderDay(day) {
        const { prefix = '', levelCoursesList } = this.props;
        const { translate } = this.context;

        return (
            <div className={prefix + 'scheduleList_day'} key={day.day}>
                <div className={prefix + 'scheduleList_day-inner'}>
                    <h2 className={prefix + 'scheduleList_title'}>{ translate(day.day) }</h2>
                    <div className={prefix + 'scheduleList_classes'}>
                        {
                            day.classes.length && levelCoursesList.length ?
                                day.classes.map((item) => this._renderClass(item))
                                :
                                <div>PLACEHOLDER Немає уроків</div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    _renderClass(item) {
        const { prefix, levelCoursesList, coursesList } = this.props;
        const courseID = levelCoursesList.find(levelCourse => Object.keys(levelCourse)[0] === item.subject)[item.subject];

        return (
            <ScheduleItem
                levelCoursesList={levelCoursesList}
                subject={item.subject}
                key={item.id}
                prefix={prefix}
                courseID={courseID}
                course={coursesList.find(item => item.id === courseID)}
            />
        )
    }

    filterSchedule(schedule) {
        const { current } = this.props;
        let filteredSchedule = [];

        if ( current ) {
            const currentDay = new Date().getDay();
            const nextDay = currentDay < 4 ? currentDay + 1 : 1;
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
}
ScheduleList.contextType = siteSettingsContext;
