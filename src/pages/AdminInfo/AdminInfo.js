import React, { useContext } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import AdminInfoManuals from '../../components/AdminInfo/AdminInfoManuals';

import * as subjectsJSON from '../../info/admin/subjects/subjects';

const manuals = [
    subjectsJSON.default
];

export default function AdminInfo() {
    const { translate } = useContext(siteSettingsContext);

    return (
        <section className="section">
            <div className="section__title-holder">
                <h2 className="section__title">
                    <i className="content_title-icon fa fa-info"/>
                    { translate('info') }
                </h2>
            </div>
            <div className="adminInfo widget">
                <AdminInfoManuals manuals={manuals} />
            </div>
        </section>
    );
}