import React, { useContext } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';
import AdminInfoManuals from '../../components/AdminInfo/AdminInfoManuals';
import './adminInfo.scss';
import classNames from 'classnames';

import * as subjectsJSON from '../../info/admin/subjects/subjects';
import * as videochatsJSON from '../../info/admin/videochats/videochats';

const manuals = [
    {
        id: 'videochats',
        content: videochatsJSON.default
    },
    {
        id: 'subjects',
        content: subjectsJSON.default
    }
];

export default function AdminInfo({params}) {
    const { translate } = useContext(siteSettingsContext);
    const nav = [
        {
            id: 'videochats',
            title: translate('videochats')
        },
        {
            id: 'subjects',
            title: translate('subjects')
        }
    ];

    return (
        <section className="section">
            <div className="section__title-holder">
                <h2 className="section__title">
                    <i className="content_title-icon fa fa-info"/>
                    { translate('info') }
                </h2>
            </div>
            <div className="adminInfo widget">
                <div className="adminInfo__nav-holder">
                    <div className="adminInfo__nav">
                        {
                            nav.map(navItem => {
                                return (
                                    <div className={classNames('adminInfo__navItem')}>
                                        {
                                            navItem.id === params.id ?
                                                <span>{ navItem.title }</span>
                                                :
                                                <Link to={'/admin-info/' + navItem.id}>
                                                    { navItem.title }
                                                </Link>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="adminInfo__manual-holder">
                    {
                        params.id ?
                            <AdminInfoManuals manuals={manuals} id={params.id} />
                            :
                            null
                    }
                </div>
            </div>
        </section>
    );
}