import React, { useContext } from 'react';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import AdminPanelTeachers from '../../components/AdminPanel/AdminPanelTeachers';
import AdminPanelStudents from '../../components/AdminPanel/AdminPanelStudents';
import AdminPanelCourses from '../../components/AdminPanel/AdminPanelCourses';
import AdminPanelNotifications from '../../components/AdminPanel/AdminPanelNotifications';
import Notifications from '../../components/Notifications/Notifications';
import AdminPanelTeachersCourses from '../../components/AdminPanel/AdminPanelTeachersCourses';
import AdminEvents from "../../components/AdminEvents/AdminEvents";
import './adminPanel.scss';

function AdminPanel({loading}) {
    const { translate } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);

    return (
        <div className="adminDashboard">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-home'} />
                        { translate('dashboard') }
                    </h2>
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                {
                    user.role === 'admin' ?
                        <div className="grid">
                            <div className="grid_col col-12">
                                <AdminPanelNotifications/>
                            </div>
                            <div className="grid_col col-6">
                                <AdminPanelTeachers heading={translate('staff')} showCourses />
                            </div>
                            <div className="grid_col col-6">
                                <AdminPanelTeachers heading={translate('staff_no_courses')}/>
                            </div>
                            <div className="grid_col col-6">
                                <AdminPanelCourses/>
                            </div>
                            <div className="grid_col col-6">
                                <AdminPanelStudents/>
                            </div>
                        </div>
                        :
                        null
                }
                {
                    user.role === 'teacher' ?
                        <div className="grid">
                            <div className="grid_col col-12">
                                <Notifications type="teachers"/>
                            </div>
                            <div className="grid_col col-6">
                                <AdminPanelTeachersCourses/>
                            </div>
                            <div className="grid_col col-6">
                                <AdminEvents/>
                            </div>
                        </div>
                        :
                        null
                }
            </section>
        </div>
    )
}
export default AdminPanel;
