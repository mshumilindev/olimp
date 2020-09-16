import React, {useContext, useEffect, useMemo} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { withRouter, Link } from 'react-router-dom';
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

function AdminInfo({location, history, params}) {
    const { translate } = useContext(siteSettingsContext);
    const nav = useMemo(() => (
        [
            {
                id: 'videochats',
                title: translate('videochats'),
                sections: manuals.find(item => item.id === 'videochats').content.sections.map(sectionItem => {return {title: sectionItem.sectionTitle, id: sectionItem.sectionID}})
            },
            {
                id: 'subjects',
                title: translate('subjects'),
                sections: manuals.find(item => item.id === 'subjects').content.sections.map(sectionItem => {return {title: sectionItem.sectionTitle, id: sectionItem.sectionID}})
            }
        ]
    ), [translate]);

    useEffect(() => {
        if ( location.hash && location.hash.indexOf('#') !== -1 ) {
            const id = location.hash.replace('#', '');

            setTimeout(() => {
                window.scrollTo({
                    top: document.getElementById(id).offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
        else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [location]);

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
                                    <div className={classNames('adminInfo__navItem')} key={navItem.id}>
                                        {
                                            navItem.id === params.id ?
                                                <span>
                                                    { navItem.title }
                                                    <ul>
                                                        {
                                                            navItem.sections.map(section => {
                                                                return (
                                                                    <li key={section.id}>
                                                                        <Link to={/admin-info/ + navItem.id + '#' + section.id}>{ section.title }</Link>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </span>
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

export default withRouter(AdminInfo);