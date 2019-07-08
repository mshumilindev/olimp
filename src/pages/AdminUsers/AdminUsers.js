import React, { useContext } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from "react-redux";
import {Preloader} from "../../components/UI/preloader";

function AdminUsers({usersList, loading}) {
    const { translate, lang } = useContext(siteSettingsContext);

    console.log(usersList);

    return (
        <>
            <section className="section">
                <h2 className="section__title">
                    <i className={'content_title-icon fa fa-users'} />
                    { translate('users') }
                </h2>
                {
                    usersList.length ?
                        <div className="adminUsers">
                            { usersList.map(user => _renderUsers(user)) }
                        </div>
                        :
                        <Preloader/>
                }
            </section>
        </>
    );

    function _renderUsers(user) {
        return (
            <div className="adminUsers__item" key={user.name[lang]}>
                { user.name[lang] }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(AdminUsers);
