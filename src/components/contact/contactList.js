import React from 'react';
import './contactList.scss';
import PropTypes from 'prop-types';
import SiteSettingsContext from "../../context/siteSettingsContext";
import { Preloader } from '../UI/preloader';

export default class ContactList extends React.Component {

    render() {
        const { contactList, loading } = this.props;

        return (
            <div className="contactList">
                {
                    loading ?
                        <Preloader size={50}/>
                        :
                        contactList.map(item => this._renderItem(item))
                }
            </div>
        )
    }

    _renderItem(item) {
        const { lang } = this.context;

        return (
            <div className="contactList_item" key={item.id}>
                <div className="contactList_title">{ item.name[lang] ? item.name[lang] : item.name['ua'] }:</div>
                <div className="contactList_phone">
                    <a href="tel:+380990221016">{ this.formatPhone(item.phone) }</a>
                </div>
            </div>
        )
    }

    formatPhone(phone) {
        let newPhone = '';

        if ( phone.includes('+380') ) {
            phone = phone.substr(4, phone.length);
        }
        newPhone += '+380';

        const phoneArr = [phone.substr(2, 3), phone.substr(5, 2), phone.substr(7, 2)];

        newPhone += ' (' + phone.substr(0, 2) + ') ' + phoneArr.join('-');


        return newPhone;
    }
}
ContactList.contextType = SiteSettingsContext;

ContactList.propTypes = {
    contactList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.object.isRequired,
            phone: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    loading: PropTypes.bool.isRequired
};
