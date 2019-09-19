import React, { useContext, useState, useEffect } from 'react';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import {fetchContact, updateContact} from "../../redux/actions/contactActions";
import {fetchSiteSettings, updateSiteSettings} from "../../redux/actions/siteSettingsActions";
import {Preloader} from "../../components/UI/preloader";
import generator from "generate-password";
import './adminSettings.scss';
import AdminSettingsContact from '../../components/AdminSettings/AdminSettingsContact';
import AdminSettingsSettings from '../../components/AdminSettings/AdminSettingsSettings';

function AdminSettings({contactList, loading, updateContact, siteSettingsList, siteSettingsLoading, updateSiteSettings}) {
    const { translate } = useContext(siteSettingsContext);
    const [ initialContacts, setInitialContacts ] = useState(null);
    const [ contacts, setContacts ] = useState(null);
    const [ initialSiteSettings, setInitialSiteSettings ] = useState(null);
    const [ siteSettings, setSiteSettings ] = useState(null);
    const [ settingsUpdated, setSettingsUpdated ] = useState(false);

    const emptyBlock = {
        name: {
            ua: '',
            ru: '',
            en: ''
        },
        id: generateID(),
        phone: ''
    };

    if ( (contactList && !contacts) || JSON.stringify(contactList) !== initialContacts ) {
        setContacts(JSON.stringify(contactList));
        setInitialContacts(JSON.stringify(contactList));
    }

    if ( (siteSettingsList && !siteSettings) || JSON.stringify(siteSettingsList) !== initialSiteSettings ) {
        setSiteSettings(JSON.stringify(siteSettingsList));
        setInitialSiteSettings(JSON.stringify(siteSettingsList));
    }

    useEffect(() => {
        if ( contactList && siteSettingsList ) {
            if ( initialContacts !== contacts || initialSiteSettings !== siteSettings ) {
                setSettingsUpdated(true);
            }
            else {
                setSettingsUpdated(false);
            }
        }
    });

    return (
        <div className="adminSettings">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-cogs" />
                        { translate('settings') }
                    </h2>
                    <div className="section__title-actions">
                        <a href="/" className="btn btn__success" disabled={!settingsUpdated} onClick={e => updateSettings(e)}>
                            <i className="content_title-icon fa fa-save" />
                            { translate('save') }
                        </a>
                    </div>
                </div>
                <div className="grid">
                    <div className="grid_col col-6">
                        <div className="widget">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-info"/>
                                { translate('info') }
                            </div>
                            {
                                siteSettingsList ?
                                    <AdminSettingsSettings updateModel={updateModel} siteSettings={siteSettings}/>
                                    :
                                    siteSettingsLoading ?
                                        <Preloader/>
                                        :
                                        <div className="nothingFound">
                                            { translate('nothing_found') }
                                        </div>
                            }
                            {
                                siteSettingsList && loading ?
                                    <Preloader/>
                                    :
                                    null
                            }
                        </div>
                    </div>
                    <div className="grid_col col-6">
                        <div className="widget">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-mobile-alt"/>
                                { translate('contact') }
                            </div>
                            {
                                contactList ?
                                    <AdminSettingsContact updateModel={updateModel} contacts={contacts} addBlock={addBlock} removeBlock={removeBlock}/>
                                    :
                                    loading ?
                                        <Preloader/>
                                        :
                                        <div className="nothingFound">
                                            { translate('nothing_found') }
                                        </div>
                            }
                            {
                                contactList && loading ?
                                    <Preloader/>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    function updateSettings(e) {
        e.preventDefault();

        if ( settingsUpdated ) {
            updateContact(JSON.parse(contacts));
            updateSiteSettings(JSON.parse(siteSettings));
        }
    }

    function addBlock() {
        const newList = JSON.parse(contacts);

        newList.push({
            ...emptyBlock
        });

        setContacts(JSON.stringify(newList));
    }

    function removeBlock(blockID) {
        const newList = JSON.parse(contacts);

        newList.splice(newList.indexOf(newList.find(item => item.id === blockID)), 1);

        setContacts(JSON.stringify(newList));
    }

    function generateID() {
        return generator.generate({
            length: 16,
            strict: true
        });
    }

    function updateModel(fieldID, value) {
        const newList = JSON.parse(contacts);
        const strippedID = fieldID.substr(0, fieldID.indexOf('_'));
        const currentField = newList.find(item => item.id === strippedID);

        const newSiteSettings = JSON.parse(siteSettings);

        if ( fieldID.includes('_nameUA') ) {
            currentField.name.ua = value;
        }
        else if ( fieldID.includes('_nameRU') ) {
            currentField.name.ru = value;
        }
        else if ( fieldID.includes('_nameEN') ) {
            currentField.name.en = value;
        }
        else if ( fieldID.includes('_tel') ) {
            currentField.phone = value;
        }
        else if ( fieldID.includes('siteName_UA') ) {
            newSiteSettings.siteName.ua = value;
        }
        else if ( fieldID.includes('siteName_RU') ) {
            newSiteSettings.siteName.ru = value;
        }
        else if ( fieldID.includes('siteName_EN') ) {
            newSiteSettings.siteName.en = value;
        }
        else if ( fieldID === 'logo' ) {
            newSiteSettings.logo.url = value;
        }

        if ( fieldID.includes('_nameUA') || fieldID.includes('_nameRU') || fieldID.includes('_nameEN') || fieldID.includes('_tel') ) {
            setContacts(JSON.stringify(newList));
        }
        else {
            setSiteSettings(JSON.stringify(newSiteSettings));
        }
    }
}
const mapStateToProps = state => ({
    contactList: state.contactReducer.contactList,
    loading: state.contactReducer.loading,
    siteSettingsList: state.siteSettingsReducer.siteSettingsList,
    siteSettingsLoading: state.siteSettingsReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchContact: dispatch(fetchContact()),
    updateContact: contacts => dispatch(updateContact(contacts)),
    fetchSiteSettings: dispatch(fetchSiteSettings()),
    updateSiteSettings: siteSettings => dispatch(updateSiteSettings(siteSettings))
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminSettings, true));