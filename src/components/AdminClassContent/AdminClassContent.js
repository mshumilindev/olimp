import React, {useContext, useEffect, useState} from 'react';
import Preloader from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import UserPicker from '../UI/UserPicker/UserPicker';
import CoursesPicker from '../UI/CoursesPicker/CoursesPicker';
import {connect} from "react-redux";
import AdminClassScheduleDay from './AdminClassScheduleDay';

function AdminClassContent({content, loading, setContent, usersList, canEdit}) {
    const { translate } = useContext(siteSettingsContext);
    const [ students, setStudents ] = useState(null);
    const [ courses, setCourses ] = useState([]);
    const [ schedule, setSchedule ] = useState([]);

    useEffect(() => {
        if ( content ) {
            setStudents(Object.assign([], filterStudents()));
            setCourses(Object.assign([], content.courses));
            setSchedule(Object.assign([], content.schedule));
        }
    }, [content]);


    return (
        <>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-book"/>
                    { translate('courses') }
                </div>
                {
                    <CoursesPicker selectedCourses={JSON.stringify(courses)} handleAddCourses={handleAddCourses} noControls={!canEdit}/>
                }
            </div>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-calendar-alt"/>
                    { translate('schedule') }
                </div>
                {
                    content ?
                        courses.length ?
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
                    content ?
                        <UserPicker type="student" noneditable selectedList={students ? students : []} />
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
        const parsedSchedule = schedule;

        return (
            <div className="adminClass__schedule">
                {
                    parsedSchedule.map(day => <AdminClassScheduleDay day={day} key={day.title} selectedCourses={courses} content={content} handleAddSchedule={handleAddSchedule} canEdit={canEdit}/>)
                }
            </div>
        )
    }

    function filterStudents() {
        const newUsersList = usersList.filter(user => user.role === 'student' && user.class && user.class === content.id && user.status === 'active');
        const idList = [];

        if ( newUsersList.length ) {
            newUsersList.forEach(user => {
                idList.push(user.id);
            });
        }

        return idList;
    }

    function handleAddSchedule(newDay) {
        const newSchedule = schedule;

        newSchedule.find(item => item.title === newDay.title).lessons = newDay.lessons;

        setContent({
            ...content,
            schedule: [
                ...newSchedule
            ]
        });
    }

    function handleAddCourses(selectedCourses) {
        setContent({
            ...content,
            courses: JSON.parse(selectedCourses)
        });
    }
}

const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading,
    user: state.authReducer.currentUser
});
export default connect(mapStateToProps)(AdminClassContent);
