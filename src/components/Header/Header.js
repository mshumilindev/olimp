import React, {useContext, useState} from 'react';
import './header.scss';
import SiteSettingsContext from "../../context/siteSettingsContext";
import LanguageSelect from '../language/languageSelect';
import Confirm from '../UI/Confirm/Confirm';
import {connect} from "react-redux";
import { fetchClasses } from "../../redux/actions/classesActions";
import { setUpdates } from '../../redux/actions/updatesActions';
import { logoutUser } from '../../redux/actions/authActions';

function Header({user, classesList, setUpdates, logoutUser}) {
    const { translate, lang } = useContext(SiteSettingsContext);
    const [ showConfirmLogout, setShowConfirmLogout ] = useState(false);

    return (
        <header className="header">
            <div className="header__user">
                <div className="header__user-avatar" style={{backgroundImage: 'url(' + user.avatar + ')'}}>
                    {
                        !user.avatar ?
                            <i className="header__user-avatar-icon fas fa-user"/>
                            :
                            null
                    }
                </div>
                <div className="header__user-name">
                    { user.name }
                    <div className="header__user-role">
                        { translate(user.role) }
                        {
                            user.class && classesList ?
                                <div className="header__user-class">
                                    {
                                        classesList.find(item => item.id === user.class).title[lang] ?
                                            classesList.find(item => item.id === user.class).title[lang]
                                            :
                                            classesList.find(item => item.id === user.class).title['ua']
                                    }
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
                {
                    user.role === 'admin' ?
                        <div className="header__flush-storage" style={{marginLeft: 20}}>
                            <span className="btn btn_primary" onClick={setVersion}>Version change</span>
                        </div>
                        :
                        null
                }
            </div>
            <div className="header__actions">
                <div className="header__actions-item header__language">
                    <LanguageSelect />
                </div>
                <div className="header__divider" />
                <div className="header__actions-item header__logout" onClick={() => setShowConfirmLogout(true)}>
                    <i className="header__icon fas fa-sign-out-alt" />
                    <span className="header__icon-descr">{ translate('logout') }</span>
                </div>
            </div>
            {
                showConfirmLogout ?
                    <Confirm message={translate('sure_to_logout')} confirmAction={onConfirmLogout} cancelAction={() => setShowConfirmLogout(false)}/>
                    :
                    null
            }
        </header>
    );

    function setVersion() {
        setUpdates('version');
    }

    function onConfirmLogout() {
        logoutUser(user.id);
    }
}
const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    user: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
    fetchClasses: dispatch(fetchClasses()),
    setUpdates: (type) => dispatch(setUpdates(type)),
    logoutUser: (userID) => dispatch(logoutUser(userID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
