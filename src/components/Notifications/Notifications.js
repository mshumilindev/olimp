import React, {useContext, useEffect} from 'react';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import {fetchNotifications} from "../../redux/actions/notificationsActions";

/**
 * @return {null}
 */
function Notifications({user, fetchNotifications, notificationsList}) {
    const { lang } = useContext(siteSettingsContext);

    useEffect(() => {
        fetchNotifications(user.id);
    }, []);

    if ( notificationsList && filteredNotifications().length ) {
        return (
            filteredNotifications().map(notification => _renderNotification(notification))
        )
    }
    return null;

    function _renderNotification(notification) {
        return (
            <div className={'notification ' + notification.type} key={notification.id}>
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
    loading: state.usersReducer.loading,
    user: state.authReducer.currentUser
});

const mapDispatchToProps = dispatch => ({
    fetchNotifications: (userID) => dispatch(fetchNotifications(userID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
