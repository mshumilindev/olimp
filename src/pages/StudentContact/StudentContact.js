import React, { useContext } from 'react';
import {fetchContact} from "../../redux/actions/contactActions";
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../../components/UI/preloader";
import './studentContact.scss';

function StudentContact({contactList, loading}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="studentContact">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-mobile-alt" />
                    { translate('contact') }
                </h2>
            </div>
            {
                loading ?
                    <Preloader/>
                    :
                    contactList ?
                        <div className="studentContact__list">
                            { contactList.sort((a, b) => a.order - b.order).map(item => _renderContact(item)) }
                        </div>
                        :
                        null
            }
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
                    { item.phone }
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    loading: state.contactReducer.loading,
    contactList: state.contactReducer.contactList
});

const mapDispatchToProps = dispatch => ({
    fetchContact: dispatch(fetchContact())
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentContact);