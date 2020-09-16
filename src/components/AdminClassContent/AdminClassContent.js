import React, {useContext} from 'react';
import Preloader from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import UserPicker from '../UI/UserPicker/UserPicker';
import CoursesPicker from '../UI/CoursesPicker/CoursesPicker';
import {connect} from "react-redux";
import AdminClassScheduleDay from './AdminClassScheduleDay';

function AdminClassContent({content, loading, setContent, usersList, canEdit}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-book"/>
                    { translate('courses') }
                </div>
                {
                    <CoursesPicker selectedCourses={content ? JSON.stringify(content.courses) : []} handleAddCourses={handleAddCourses} noControls={!canEdit}/>
                }
            </div>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-calendar-alt"/>
                    { translate('schedule') }
                </div>
                {
                    content ?
                        content.courses.length ?
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
                        <UserPicker type="student" noneditable selectedList={filterStudents() ? filterStudents() : []} />
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
        const parsedSchedule = content.schedule;

        return (
            <div className="adminClass__schedule">
                {
                    parsedSchedule.map(day => <AdminClassScheduleDay day={day} key={day.title} selectedCourses={content.courses} content={content} handleAddSchedule={handleAddSchedule} canEdit={canEdit}/>)
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
        const newSchedule = content.schedule;

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
