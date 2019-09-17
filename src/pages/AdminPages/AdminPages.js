import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import {fetchStaticInfo, removePage, createPage} from "../../redux/actions/staticInfoActions";
import {Preloader} from "../../components/UI/preloader";
import Confirm from '../../components/UI/Confirm/Confirm';
import './adminPages.scss';
import generator from "generate-password";

const Modal = React.lazy(() => import('../../components/UI/Modal/Modal'));
const Form = React.lazy(() => import('../../components/Form/Form'));

// === Need to move this to a separate file from all the files it's used in
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function AdminPages({list, searchQuery, filters, loading, removePage, createPage}) {
    const { translate, lang, transliterize, identify } = useContext(siteSettingsContext);
    const [ showRemovePage, setShowRemovePage ] = useState(null);
    const [ showCreatePage, setShowCreatePage ] = useState(false);
    const [ formUpdated, setFormUpdated ] = useState(false);
    const initialNewPage = {
        name: {
            ua: '',
            ru: '',
            en: ''
        },
        featured: ''
    };
    const initialNewPageFields = [
        {
            value: '',
            id: 'featured',
            type: 'image',
            updated: false,
            size: 200,
            shape: 'landscape',
            label: translate('upload'),
            icon: 'fa fa-image'
        },
        {
            value: '',
            id: 'name_ua',
            placeholder: translate('title') + ' ' + translate('in_ua'),
            type: 'text',
            updated: false,
            required: true
        },
        {
            value: '',
            id: 'name_ru',
            placeholder: translate('title') + ' ' + translate('in_ru'),
            type: 'text',
            updated: false
        },
        {
            value: '',
            id: 'name_en',
            placeholder: translate('title') + ' ' + translate('in_en'),
            type: 'text',
            updated: false
        },
        {
            type: 'submit',
            id: 'submit_create_page',
            name: translate('create')
        }
    ];
    const [ newPage, setNewPage ] = useState({
        name: {
            ua: '',
            ru: '',
            en: ''
        }
    });
    const [ newPageFields, setNewPageFields ] = useState(initialNewPageFields);
    let prevList = usePrevious(JSON.stringify(list));

    useEffect(() => {
        if ( !loading && JSON.stringify(list) !== prevList && showCreatePage ) {
            hideModal();
        }
    });

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
                            <a href="/" className="btn btn_primary" onClick={e => startCreatePage(e)}>
                                <i className="content_title-icon fa fa-plus"/>
                                { translate('create_page') }
                            </a>
                        </span>
                    </div>
                </div>
                { filters }
                <div className="adminPages__list widget">
                    {
                        loading ?
                            <Preloader/>
                            :
                            !list.length ?
                                <div className="nothingFound">
                                    <a href="/" className="btn btn_primary" onClick={e => startCreatePage(e)}>
                                        <i className="content_title-icon fa fa-plus"/>
                                        { translate('create_page') }
                                    </a>
                                </div>
                                :
                                filterPages(list) && filterPages(list).length ?
                                    <div className="grid">
                                        {
                                            filterPages(list).map(item => {
                                                return (
                                                    <div className="grid_col col-3 large-col-2" key={item.id}>
                                                        <div className="adminPages__list-item">
                                                            <Link to={'/admin-pages/' + item.slug} className="adminPages__list-link">
                                                                <div className="adminPages__list-featured" style={{backgroundImage: 'url(' + item.featured + ')'}}>
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
                                                            </Link>
                                                            <span className="adminPages__list-remove" onClick={() => setShowRemovePage(item.id)}>
                                                            <i className="fa fa-trash-alt"/>
                                                        </span>
                                                        </div>
                                                        {
                                                            showRemovePage === item.id ?
                                                                <Confirm message={translate('sure_to_remove_page')} confirmAction={() => handleRemovePage(item.id)} cancelAction={() => setShowRemovePage(false)} />
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <div className="nothingFound">
                                        { translate('nothing_found') }
                                    </div>
                    }
                </div>
            </section>
            {
                showCreatePage ?
                    <Modal onHideModal={hideModal}>
                        <Form fields={newPageFields} heading={translate('create_page')} setFieldValue={handleNewPageValue} formAction={handleCreatePage} formUpdated={formUpdated} loading={loading} />
                    </Modal>
                    :
                    null
            }
        </div>
    );

    function handleCreatePage() {
        const newPageID = generator.generate({
            length: 16,
            strict: true
        });
        createPage(newPageID, {
            ...newPage,
            slug: identify(transliterize(newPage.name.ua))
        });
    }

    function hideModal() {
        setNewPage(initialNewPage);
        setNewPageFields(initialNewPageFields);
        setShowCreatePage(false);
    }

    function handleNewPageValue(fieldID, value) {
        const tempNewPage = newPage;

        newPageFields.find(field => field.id === fieldID).value = value;
        newPageFields.find(field => field.id === fieldID).updated = !!value.length;

        setNewPageFields(newPageFields);

        if ( fieldID === 'name_ua' ) {
            tempNewPage.name.ua = value;
        }
        if ( fieldID === 'name_ru' ) {
            tempNewPage.name.ru = value;
        }
        if ( fieldID === 'name_en' ) {
            tempNewPage.name.en = value;
        }
        if ( fieldID === 'featured' ) {
            tempNewPage.featured = value;
        }

        setNewPage({
            ...tempNewPage
        });

        if ( tempNewPage.name.ua ) {
            setFormUpdated(true);
        }
        else {
            setFormUpdated(false);
        }
    }

    function handleRemovePage(pageID) {
        removePage(pageID);
        setShowRemovePage(null);
    }

    function startCreatePage(e) {
        e.preventDefault();
        setShowCreatePage(true);
    }

    function filterPages() {
        const editedSearchQuery = searchQuery.toLowerCase();
        let newPages = list;

        if ( list ) {
            if ( editedSearchQuery.trim() ) {
                newPages = list.filter(item => item.name.ua.toLowerCase().includes(editedSearchQuery) || item.name.ru.toLowerCase().includes(editedSearchQuery) || item.name.ua.toLowerCase().includes(editedSearchQuery));
            }
        }

        return newPages.sort((a, b) => {
            if ( a.name[lang] < b.name[lang] ) {
                return -1;
            }
            else if ( a.name[lang] > b.name[lang] ) {
                return 1;
            }
            return 0;
        });
    }
}
const mapStateToProps = state => ({
    list: state.staticInfoReducer.staticInfoList,
    loading: state.staticInfoReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchStaticInfo: dispatch(fetchStaticInfo()),
    removePage: (pageID) => dispatch(removePage(pageID)),
    createPage: (pageID, info) => dispatch(createPage(pageID, info))
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminPages, true));