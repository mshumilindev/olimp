import React, { useContext } from 'react';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import {fetchStaticInfo} from "../../redux/actions/staticInfoActions";
import {Preloader} from "../../components/UI/preloader";
import './adminPages.scss';

function AdminPages({list, searchQuery, filters, loading}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="adminPages">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-copy'} />
                        { translate('pages') }
                    </h2>
                    <div className="section__title-actions">
                        <span>
                            <a href="/" className="btn btn_primary" onClick={e => createPage(e)}>
                                <i className="content_title-icon fa fa-plus"/>
                                { translate('create_page') }
                            </a>
                        </span>
                    </div>
                </div>
                { filters }
                <div className="adminPages__list widget">
                    {
                        filterPages(list) && filterPages(list).length ?
                            <div className="grid">
                                {
                                    filterPages(list).map(item => {
                                        return (
                                            <div className="grid_col col-3 large-col-2" key={item.id}>
                                                <a href={'/admin-pages/' + item.slug} className="adminPages__list-item">
                                                    <div className="adminPages__list-featured">
                                                        {
                                                            !item.featured ?
                                                                <i className="content_title-icon fa fa-image"/>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    <h2 className="adminPages__list-title">
                                                        { item.name[lang] ? item.name[lang] : item.name['ua'] }
                                                    </h2>
                                                </a>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            !searchQuery ?
                                <Preloader/>
                                :
                                <div className="nothingFound">
                                    { translate('nothing_found') }
                                </div>
                    }
                </div>
            </section>
        </div>
    );

    function createPage(e) {
        e.preventDefault();
    }

    function filterPages() {
        const editedSearchQuery = searchQuery.toLowerCase();
        let newPages = list;

        if ( list ) {
            if ( editedSearchQuery.trim() ) {
                newPages = list.filter(item => item.name.ua.toLowerCase().includes(editedSearchQuery) || item.name.ru.toLowerCase().includes(editedSearchQuery) || item.name.ua.toLowerCase().includes(editedSearchQuery));
            }
        }

        return newPages;
    }
}
const mapStateToProps = state => ({
    list: state.staticInfoReducer.staticInfoList,
    loading: state.staticInfoReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchStaticInfo: dispatch(fetchStaticInfo()),
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminPages, true));