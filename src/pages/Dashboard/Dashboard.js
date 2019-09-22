import React, { useContext } from 'react';
import './dashboard.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import NextSchedule from '../../components/Schedule/NextSchedule';
import Notifications from '../../components/Notifications/Notifications';

function Dashboard() {
    const { translate } = useContext(siteSettingsContext);

    return (
        <>
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-home" />
                    { translate('dashboard') }
                </h2>
            </div>
            <Notifications type="students"/>
            <section className="section">
                <NextSchedule/>
            </section>
            {/*<section className="section">*/}
            {/*    Modules*/}
            {/*</section>*/}
            {/*<section className="section">*/}
            {/*    Grades*/}
            {/*</section>*/}
        </>
    )
}
export default Dashboard;