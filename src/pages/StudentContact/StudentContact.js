import React, { useContext } from 'react';
import {fetchContact} from "../../redux/actions/contactActions";
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import Preloader from "../../components/UI/preloader";
import './studentContact.scss';
import Contact from '../../components/Contact/Contact';
import Map from '../../components/Map/Map';
import Notifications from "../../components/Notifications/Notifications";

function StudentContact({contactList, loading, address}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="studentContact">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-mobile-alt" />
                    { translate('contact') }
                </h2>
            </div>
            <Notifications/>
            {
                address ?
                    <>
                        { address.value }
                        <Map address={address.value}/>
                    </>
                    :
                    null
            }
            {
                loading ?
                    <Preloader/>
                    :
                    contactList ?
                        <Contact contactList={contactList.sort((a, b) => a.order - b.order)}/>
                        :
                        null
            }
        </div>
    );
}
const mapStateToProps = state => ({
    loading: state.contactReducer.loading,
    contactList: state.contactReducer.contactList,
    address: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.address : null
});

const mapDispatchToProps = dispatch => ({
    fetchContact: dispatch(fetchContact())
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentContact);