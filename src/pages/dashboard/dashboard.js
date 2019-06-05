import React, {Fragment} from 'react';
import './dashboard.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import Aside from "../../components/aside/aside";

export default class Dashboard extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="grid_col large-col-9 medium-col-8">
                    <section className="section">
                        Modules
                    </section>
                    <section className="section">
                        Grades graph
                    </section>
                </div>
                <div className="grid_col large-col-3 medium-col-4">
                    <Aside/>
                </div>
            </Fragment>
        )
    }
}

Dashboard.contextType = SiteSettingsContext;
