import React, { useContext, useState } from 'react';
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import UserPicker from '../UI/UserPicker/UserPicker';
import CoursesPicker from '../UI/CoursesPicker/CoursesPicker';
import {connect} from "react-redux";
import AdminClassScheduleDay from './AdminClassScheduleDay';

function AdminClassContent({content, loading, setContent, usersList}) {
    const { translate } = useContext(siteSettingsContext);
    const [ students, setStudents ] = useState(null);
    const [ courses, setCourses ] = useState(JSON.stringify([]));
    const [ schedule, setSchedule ] = useState(JSON.stringify([]));

    const parsedContent = JSON.parse(content);

    if ( parsedContent ) {
        if ( JSON.stringify(filterStudents()) !== students ) {
            setStudents(JSON.stringify(filterStudents()));
        }
        if ( JSON.stringify(parsedContent.courses) !== courses ) {
            setCourses(JSON.stringify(parsedContent.courses));
        }
        if ( JSON.stringify(parsedContent.schedule) !== schedule ) {
            setSchedule(JSON.stringify(parsedContent.schedule));
        }
    }

    return (
        <>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-book"/>
                    { translate('courses') }
                </div>
                {
                    <CoursesPicker selectedCourses={courses} handleAddCourses={handleAddCourses}/>
                }
            </div>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-calendar-alt"/>
                    { translate('schedule') }
                </div>
                {
                    parsedContent ?
                        JSON.parse(courses).length ?
                            _renderSchedule()
                            :
                            <div className="nothingFound">
                                { translate('first_select_courses') }
                            </div>
                        :
                        loading ?
                            <Preloader/>
                            :
                            null
                }
            </div>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-users"/>
                    { translate('students') }
                </div>
                {
                    parsedContent ?
                        <UserPicker type="student" noneditable selectedList={JSON.parse(students) ? JSON.parse(students) : []} />
                        :
                        loading ?
                            <Preloader/>
                            :
                            null
                }
            </div>
        </>
    );

    function _renderSchedule() {
        const parsedSchedule = JSON.parse(schedule);

        return (
            <div className="adminClass__schedule">
                {
                    parsedSchedule.map(day => <AdminClassScheduleDay day={day} key={day.title} selectedCourses={JSON.parse(courses)}content={content} handleAddSchedule={handleAddSchedule}/>)
                }
            </div>
        )
    }

    function filterStudents() {
        const newUsersList = usersList.filter(user => user.role === 'student' && user.class && user.class === parsedContent.id);
        const idList = [];

        if ( newUsersList.length ) {
            newUsersList.forEach(user => {
                idList.push(user.id);
            });
        }

        return idList;
    }

    function handleAddSchedule(newDay) {
        const newSchedule = JSON.parse(schedule);

        newSchedule.find(item => item.title === newDay.title).lessons = newDay.lessons;

        setContent({
            ...JSON.parse(content),
            schedule: [
                ...newSchedule
            ]
        });
    }

    function handleAddCourses(selectedCourses) {
        setContent({
            ...JSON.parse(content),
            courses: JSON.parse(selectedCourses)
        });
    }
}

const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(AdminClassContent);
