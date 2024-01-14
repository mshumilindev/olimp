import React, { useContext } from 'react';
import './dashboard.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import NextSchedule from '../../components/Schedule/NextSchedule';
import Notifications from '../../components/Notifications/Notifications';
import StudentChatsList from "../../components/StudentChatsList/StudentChatsList";
import StudentTests from '../../components/StudentTests';

function Dashboard() {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="dashboard">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-home" />
                    { translate('dashboard') }
                </h2>
            </div>
            <Notifications/>
            <section className="section">
                <NextSchedule/>
            </section>
            <section className="section">
                <StudentChatsList showTodayOnly />
            </section>
            <section className="section">
                <StudentTests/>
            </section>
        </div>
    )
}
export default Dashboard;
