import React, { useContext, useRef, useState } from 'react';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import {updateTranslation} from "../../redux/actions/translationsActions";
import {setUpdates} from "../../redux/actions/updatesActions";
import Preloader from "../../components/UI/preloader";

const AdminTranslationsList = React.lazy(() => import('../../components/AdminTranslationsList/AdminTranslationsList'));

function AdminTranslations({translationsList, searchQuery, showPerPage, filters, updateTranslation, loading, setUpdates}) {
    const { translate } = useContext(siteSettingsContext);
    const $block = useRef(null);
    const [ isLoaded, setIsLoaded ] = useState(false);

    return (
        <div className="adminTranslations" ref={$block}>
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-language'} />
                        { translate('translations') }
                    </h2>
                    <div className="section__title-actions">
                        <span>
                            <a href="/" className="btn btn__success" onClick={e => handleUpdateTranslations(e)}>
                                <i className="content_title-icon fa fa-save"/>
                                { translate('save') }
                            </a>
                        </span>
                    </div>
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                { filters }
                <AdminTranslationsList isLoaded={isLoaded} setIsLoaded={setIsLoaded} showPerPage={showPerPage} list={filterTranslations()} searchQuery={searchQuery} loading={loading}/>
            </section>
        </div>
    );

    function filterTranslations() {
        const editedSearchQuery = searchQuery.toLowerCase();
        let newTranslations = translationsList;

        if ( translationsList ) {
            if ( editedSearchQuery.trim() ) {
                newTranslations = translationsList.filter(item => item.id.toLowerCase().includes(editedSearchQuery) || item.langs.some(lang => lang[Object.keys(lang)].toLowerCase().includes(editedSearchQuery)));
            }
        }

        return newTranslations;
    }

    function handleUpdateTranslations(e) {
        e.preventDefault();

        const updatedFields = $block.current.querySelectorAll('.isUpdated');

        if ( updatedFields.length ) {
            if ( [...updatedFields].every(field => field.value) ) {
                updatedFields.forEach(field => {
                    const lang = field.title.substr(0, field.title.indexOf('_'));
                    const key = field.title.substr(field.title.indexOf('_') + 1, field.length);

                    updateTranslation(lang, key, field.value);
                    setIsLoaded(false);
                    setUpdates('translations')
                });
            }
        }
    }
}
const mapStateToProps = state => ({
    translationsList: state.translationsReducer.translationsList,
    loading: state.translationsReducer.loading
});
const mapDispatchToProps = dispatch => ({
    updateTranslation: (lang, key, value) => dispatch(updateTranslation(lang, key, value)),
    setUpdates: type => dispatch(setUpdates(type))
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminTranslations, true, true));