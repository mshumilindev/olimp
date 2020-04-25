import React, { useContext } from 'react';
import './studentNav.scss';
import { Link } from 'react-router-dom';
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';
import userContext from "../../context/userContext";
import {connect} from "react-redux";

function StudentNav({nav, hideItems, classData}) {
    const { translate, lang } = useContext(SiteSettingsContext);
    const { user } = useContext(userContext);

    return (
        <nav className="studentNav">
            <div className="studentNav__user">
                <div className="studentNav__user-avatar" style={{backgroundImage: 'url(' + user.avatar + ')'}}>
                    {
                        !user.avatar ?
                            <i className="fa fa-camera-retro"/>
                            :
                            null
                    }
                </div>
                <div className="studentNav__user-name">
                    { user.name }
                </div>
                <div className="studentNav__user-role">
                    { translate(user.role) }
                    {
                        classData && user.class ?
                            <div className="studentNav__user-class">
                                {
                                    classData.title['ua']
                                }
                            </div>
                        :
                        null
                    }
                </div>
            </div>
            <ul className="studentNav__list">
                { nav.map(item => _renderItem(item)) }
            </ul>
        </nav>
    );

    function _renderItem(item) {
        const pathName = window.location.pathname;

        if ( !hideItems || !hideItems.some(hiddenItem => item.name === hiddenItem) ) {
            return (
                <li key={item.id} className="studentNav__item">
                    <Link to={ item.url } className={classNames('studentNav__link type-' + item.name, {active: pathName.includes(item.url) && (pathName.substr(item.url.length, pathName.length).split('')[0] === '/' || pathName.substr(item.url.length, pathName.length).split('')[0] === undefined)})}>
                        <i className={'studentNav__icon ' + item.icon} />
                        <span className="studentNav__text">{ translate(item.name) }</span>
                    </Link>
                </li>
            )
        }
        return false;
    }
}
const mapStateToProps = state => ({
    loading: state.configReducer.loading,
    classData: state.classesReducer.classData
});

export default connect(mapStateToProps)(StudentNav)
