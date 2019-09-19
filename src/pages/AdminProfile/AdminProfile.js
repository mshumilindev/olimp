import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from "react-redux";
import { fetchProfile } from '../../redux/actions/usersActions';
import userContext from "../../context/userContext";
import {Preloader} from "../../components/UI/preloader";

function AdminProfile({profile, fetchProfile, params, loading}) {
    const { translate } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ profileUpdated, setProfileUpdated ] = useState(false);

    if ( !profile ) {
        if ( params && params.userID ) {
            fetchProfile(params.userID);
        }
        else {
            fetchProfile(user.id);
        }
    }

    console.log(profile);

    return (
        <div className="adminProfile">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-user" />
                        {
                            profile ?
                                <>
                                    <span className="section__title-separator">{ translate('profile') }</span>
                                    { profile.name }
                                </>
                                :
                                translate('profile')
                        }
                    </h2>
                    <div className="section__title-actions">
                        <a href="/" className="btn btn__success" disabled={!profileUpdated} onClick={e => updateProfile(e)}>
                            <i className="content_title-icon fa fa-save" />
                            { translate('save') }
                        </a>
                    </div>
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
            </section>
        </div>
    );

    function updateProfile(e) {
        e.preventDefault();

        if ( profileUpdated ) {
            console.log('update profile');
        }
    }
}
const mapStateToProps = state => ({
    profile: state.usersReducer.profile,
    loading: state.usersReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchProfile: profileID => dispatch(fetchProfile(profileID))
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminProfile);