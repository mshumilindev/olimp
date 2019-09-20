import React, { useContext } from 'react';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import AdminPanelTeachers from '../../components/AdminPanel/AdminPanelTeachers';
import AdminPanelStudents from '../../components/AdminPanel/AdminPanelStudents';
import AdminPanelCourses from '../../components/AdminPanel/AdminPanelCourses';
import './adminPanel.scss';

function AdminPanel({loading}) {
    const { translate } = useContext(siteSettingsContext);

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
                <div className="grid">
                    <div className="grid_col col-12">
                        <div className="widget">
                            Объявления
                        </div>
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
            </section>
        </div>
    )
}
export default AdminPanel;
