import React from 'react';
import {Link} from "react-router-dom";
import ConsultationsList from "../consultations/consultationsList";
import ContactContainer from "../../containers/contactContainer";
import StaticInfoContainer from "../../containers/staticInfoContainer";
import ScheduleContainer from '../../containers/scheduleContainer';
import SiteSettingsContext from "../../context/siteSettingsContext";
import './aside.scss';
import { Provider } from 'react-redux';
import { contactStore } from '../../redux/stores/contactStore';
import { scheduleStore } from '../../redux/stores/scheduleStore';
import { staticInfoListStore } from '../../redux/stores/staticInfoListStore';

export default class Aside extends React.Component {
    render() {
        const { translate } = this.context;

        return (
            <div className="aside">
                <div className="widget">
                    <h2 className="section_title widget_title">
                        <i className="widget_icon fa fa-calendar-alt" />
                        { translate('current_schedule') }
                    </h2>
                    <Provider store={scheduleStore}>
                        <ScheduleContainer current prefix="aside--" />
                    </Provider>
                    <div className="section_actions">
                        <Link to="/schedule" className="btn btn_primary">{ translate('go_to_schedule') }</Link>
                    </div>
                </div>
                <div className="widget">
                    <h2 className="section_title widget_title">
                        <i className="widget_icon fa fa-comments" />
                        { translate('consultations') }
                    </h2>
                    <ConsultationsList current prefix="aside--" />
                    <div className="section_actions">
                        <Link to="/consultations" className="btn btn_primary">{ translate('go_to_consultations') }</Link>
                    </div>
                </div>
                <div className="widget">
                    <h2 className="section_title widget_title">
                        <i className="widget_icon fa fa-phone" />
                        { translate('contact') }
                    </h2>
                    <Provider store={contactStore}>
                        <ContactContainer />
                    </Provider>
                </div>
                <div className="widget">
                    <h2 className="section_title widget_title">
                        <i className="widget_icon fa fa-info" />
                        { translate('info') }
                    </h2>
                    <Provider store={staticInfoListStore}>
                        <StaticInfoContainer />
                    </Provider>
                </div>
            </div>
        )
    }
};
Aside.contextType = SiteSettingsContext;
