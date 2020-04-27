import React, { useContext } from 'react';
import {connect} from "react-redux";
import Preloader from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';

function AdminPanelStudents({loading, usersList, classesList}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-exclamation-triangle color-warning" />
                { translate('students_no_class') }
            </div>
            {
                loading ?
                    <Preloader/>
                    :
                    usersList && classesList ?
                        <div className="adminDashboard__teachersList">
                            {
                                filterUsers().map(student => _renderTeacher(student))
                            }
                            <div className="nothingFound">
                                { translate('no_students_not_assigned') }
                            </div>
                        </div>
                        :
                        <Preloader/>
            }
        </div>
    );

    function _renderTeacher(student) {
        const selectedClass = classesList ? classesList.find(item => item.id === student.class) : null;

        if ( selectedClass ) {
            return null;
        }

        return (
            <div className="adminDashboard__teachersList-item" key={student.id}>
                <div className="adminDashboard__teachersList-avatar" style={{backgroundImage: 'url(' + student.avatar + ')'}}>
                    {
                        !student.avatar ?
                            <i className="fa fa-user" />
                            :
                            null
                    }
                </div>
                <div className="adminDashboard__teachersList-info">
                    <div className="adminDashboard__teachersList-name">
                        <Link to={'/admin-users/' + student.login}>
                            { student.name }
                        </Link>
                    </div>
                    <div className="adminDashboard__teachersList-courses">
                        <span className="no-courses">
                            <i className="content_title-icon fa fa-unlink" />
                            { translate('class_not_assigned') }
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    function filterUsers() {
        return usersList.filter(user => (user.role === 'student' && !user.class) || (user.role === 'student' && user.class.length && user.status === 'active')).sort((a, b) => {
            if ( a.name < b.name ) {
                return -1;
            }
            else if ( a.name > b.name ) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
}
const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(AdminPanelStudents);
