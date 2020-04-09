import React, {useContext } from 'react';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";

/**
 * @return {null}
 */
function Notifications({notificationsList}) {
    const { lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);

    if ( notificationsList && filteredNotifications().length ) {
        return (
            filteredNotifications().map(notification => _renderNotification(notification))
        )
    }
    return null;

    function _renderNotification(notification) {
        return (
            <div className={'notification ' + notification.type}>
                <div className="notification__icon">
                    {
                        notification.type === 'message' ?
                            <i className="fas fa-comment" />
                            :
                            notification.type === 'warning' ?
                                <i className="fa fa-exclamation-triangle" />
                                :
                                notification.type === 'error' ?
                                    <i className="fa fa-exclamation" />
                                    :
                                    null
                    }
                </div>
                <div className="notification__content">
                    {
                        notification.heading[lang] || notification.heading['ua'] ?
                            <div className="notification__heading">
                                { notification.heading[lang] ? notification.heading[lang] : notification.heading['ua'] }
                            </div>
                            :
                            null
                    }
                    {
                        notification.text[lang] || notification.text['ua'] ?
                            <div className="notification__text">
                                { notification.text[lang] ? notification.text[lang] : notification.text['ua'] }
                            </div>
                            :
                            null
                    }
                    {
                        notification.link.url && (notification.link.text[lang] || notification.link.text['ua']) ?
                            <div className="notification__link">
                                <a href={notification.link.url} target="_blank" rel="noopener noreferrer" className="btn">
                                    { notification.link.text[lang] ? notification.link.text[lang] : notification.link.text['ua'] }
                                </a>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        )
    }

    function filteredNotifications() {
        return notificationsList.filter(notification => notification.targetUsers.indexOf(user.id) !== -1);
    }
}

const mapStateToProps = state => ({
    notificationsList: state.notificationsReducer.notificationsList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(Notifications);
