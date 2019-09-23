import React, { useContext, useState, useEffect } from 'react';
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import {fetchNotifications, updateNotification} from "../../redux/actions/notificationsActions";
import AdminPanelNotificationsItem from './AdminPanelNotificationsItem';
import siteSettingsContext from "../../context/siteSettingsContext";

function AdminPanelNotifications({loading, notificationsList, updateNotification}) {
    const { translate } = useContext(siteSettingsContext);
    const [ notifications, setNotifications ] = useState(JSON.parse(null));

    useEffect(() => {
        if ( !JSON.parse(notifications) ) {
            setNotifications(JSON.stringify(notificationsList));
        }
    }, [notificationsList]);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-bell" />
                { translate('notifications') }
            </div>
            {
                loading ?
                    <Preloader/>
                    :
                    JSON.parse(notifications) ?
                        <>
                            <div className="notifications">
                                {
                                    <AdminPanelNotificationsItem type="teachers" notification={JSON.parse(notifications).teachers} setFieldValue={setFieldValue} resetNotification={resetNotification} updateNotification={(type) => updateNotification(type, JSON.parse(notifications)[type])} onConfirmRemove={onConfirmRemove} />
                                }
                            </div>
                            <div className="notifications">
                                {
                                    <AdminPanelNotificationsItem type="students" notification={JSON.parse(notifications).students} setFieldValue={setFieldValue} resetNotification={resetNotification} updateNotification={(type) => updateNotification(type, JSON.parse(notifications)[type])} onConfirmRemove={onConfirmRemove} />
                                }
                            </div>
                        </>
                        :
                        <Preloader/>
            }
        </div>
    );

    function setFieldValue(fieldID, value, type) {
        const currentNotification = JSON.parse(notifications)[type];

        if ( fieldID === 'type' ) {
            currentNotification.type = value;
        }

        if ( fieldID === 'heading_UA' ) {
            currentNotification.heading.ua = value;
        }
        if ( fieldID === 'heading_RU' ) {
            currentNotification.heading.ru = value;
        }
        if ( fieldID === 'heading_EN' ) {
            currentNotification.heading.en = value;
        }

        if ( fieldID === 'text_UA' ) {
            currentNotification.text.ua = value;
        }
        if ( fieldID === 'text_RU' ) {
            currentNotification.text.ru = value;
        }
        if ( fieldID === 'text_EN' ) {
            currentNotification.text.en = value;
        }

        if ( fieldID === 'link_UA' ) {
            currentNotification.link.text.ua = value;
        }
        if ( fieldID === 'link_RU' ) {
            currentNotification.link.text.ru = value;
        }
        if ( fieldID === 'link_EN' ) {
            currentNotification.link.text.en = value;
        }

        if ( fieldID === 'url' ) {
            currentNotification.link.url = value;
        }

        setNotifications(JSON.stringify({
            ...JSON.parse(notifications),
            [type]: {
                ...currentNotification
            }
        }));
    }

    function resetNotification(type, initialNotification) {
        setNotifications(JSON.stringify({
            ...JSON.parse(notifications),
            [type]: {
                ...initialNotification
            }
        }));
    }

    function onConfirmRemove(type) {
        const emptyNotification = {
            type: '',
            heading: {
                ua: '',
                ru: '',
                en: ''
            },
            text: {
                ua: '',
                ru: '',
                en: ''
            },
            link: {
                text: {
                    ua: '',
                    ru: '',
                    en: ''
                },
                url: ''
            }
        };

        updateNotification(type, emptyNotification);
        setNotifications(JSON.stringify({
            ...JSON.parse(notifications),
            [type]: {
                ...emptyNotification
            }
        }));
    }
}
const mapStateToProps = state => ({
    notificationsList: state.notificationsReducer.notificationsList,
    loading: state.usersReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchNotifications: dispatch(fetchNotifications()),
    updateNotification: (type, newNotification) => dispatch(updateNotification(type, newNotification))
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminPanelNotifications);
