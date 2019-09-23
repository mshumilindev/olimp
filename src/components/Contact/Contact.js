import React, { useContext } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";

function Contact({contactList}) {
    const { lang } = useContext(siteSettingsContext);

    return (
        <div className="studentContact__list">
            { contactList.sort((a, b) => a.order - b.order).map(item => _renderContact(item)) }
        </div>
    );

    function _renderContact(item) {
        return (
            <div className="studentContact__list-item" key={item.id}>
                <div className="studentContact__list-item-name">
                    { item.name[lang] ? item.name[lang] : item.name['ua'] }
                </div>
                <div className="studentContact__list-item-phone">
                    <i className="content_title-icon fa fa-mobile-alt" />
                    <a href={'tel:' + item.phone}>{ item.phone }</a>
                </div>
            </div>
        )
    }
}

export default Contact;