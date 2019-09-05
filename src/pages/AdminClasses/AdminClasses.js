import React, { useContext, useRef, useState } from 'react';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import {updateTranslation} from "../../redux/actions/translationsActions";

const AdminClassesList = React.lazy(() => import('../../components/AdminClassesList/AdminClassesList'));

function AdminClasses({}) {
    const { translate } = useContext(siteSettingsContext);
    const $block = useRef(null);
    // const [ isLoaded, setIsLoaded ] = useState(false);

    return (
        <div className="adminTranslations" ref={$block}>
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-graduation-cap'} />
                        { translate('classes') }
                    </h2>
                    <div className="section__title-actions">
                        <span>
                            <a href="/" className="btn btn_primary" onClick={e => createClass(e)}>
                                <i className="content_title-icon fa fa-plus"/>
                                { translate('create_class') }
                            </a>
                        </span>
                    </div>
                </div>
                <AdminClassesList/>
            </section>
        </div>
    );

    function createClass(e) {
        e.preventDefault();
    }
}
const mapStateToProps = state => ({
    translationsList: state.translationsReducer.translationsList,
    loading: state.translationsReducer.loading
});
const mapDispatchToProps = dispatch => ({
    updateTranslation: (lang, key, value) => dispatch(updateTranslation(lang, key, value))
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminClasses, true, true));