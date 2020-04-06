import React, {useContext} from 'react';
import siteSettingsContext from '../../context/siteSettingsContext';
import * as updatesJSON from '../../updates/updates';
import moment from "moment";
import 'moment/locale/uk';
import {orderBy} from "natural-orderby";
import './adminUpdates.scss';

moment.locale('uk');

const updates = updatesJSON.default;

export default function AdminUpdates() {
    const { translate } = useContext(siteSettingsContext);

    return (
        <section className="section">
            <div className="section__title-holder">
                <h2 className="section__title">
                    <i className="content_title-icon fa fa-list-ol" />
                    { translate('updates') }
                </h2>
            </div>
            {
                sortUpdates().map(dayItem => _renderDate(dayItem))
            }
        </section>
    );

    function _renderDate(dayItem) {
        return (
            <div className="adminUpdates widget">
                <div className="widget__title">
                    { moment(dayItem.date).format('D MMMM YYYY') }
                </div>
                <ul className="adminUpdates__list">
                    {
                        dayItem.list.map(item => <li className="adminUpdates__list-item" key={item}>{ item }</li>)
                    }
                </ul>
            </div>
        );
    }

    function sortUpdates() {
        return orderBy(updates, v => -moment(v.date).unix());
    }
}