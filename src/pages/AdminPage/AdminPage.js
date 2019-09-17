import React, { useContext, useState, useEffect } from 'react';
import { withRouter  } from 'react-router-dom';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import {fetchPage, removePage, updatePage} from "../../redux/actions/staticInfoActions";
import {Preloader} from "../../components/UI/preloader";
import Confirm from "../../components/UI/Confirm/Confirm";
import ContentEditor from "../../components/UI/ContentEditor/ContentEditor";
import Form from '../../components/Form/Form';

function AdminPage({fetchPage, params, pageData, removePage, updatePage, loading}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ page, setPage ] = useState(null);
    const [ initialPage, setInitialPage ] = useState(null);
    const [ pageUpdated, setPageUpdated ] = useState(false);
    const [ showRemovePage, setShowRemovePage ] = useState(false);
    const [ pageInfoFields, setPageInfoFields ] = useState(null);

    if ( !pageData || pageData.slug !== params.pageSlug ) {
        fetchPage(params.pageSlug);
    }
    else {
        if ( JSON.stringify(pageData) !== initialPage ) {
            setPage(JSON.parse(JSON.stringify(pageData)));
            setInitialPage(JSON.stringify(pageData));
        }
        else {
            if ( !pageInfoFields ) {
                setPageInfoFields([
                    {
                        value: page.featured,
                        id: 'featured',
                        type: 'image',
                        updated: false,
                        size: '100%',
                        shape: 'landscape',
                        icon: 'fa fa-image'
                    },
                    {
                        value: page.name.ua,
                        id: 'name_ua',
                        placeholder: translate('title') + ' ' + translate('in_ua'),
                        type: 'text',
                        updated: false
                    },
                    {
                        value: page.name.ru,
                        id: 'name_ru',
                        placeholder: translate('title') + ' ' + translate('in_ru'),
                        type: 'text',
                        updated: false
                    },
                    {
                        value: page.name.en,
                        id: 'name_en',
                        placeholder: translate('title') + ' ' + translate('in_en'),
                        type: 'text',
                        updated: false
                    },
                ]);
            }
        }
    }

    useEffect(() => {
        if ( page ) {
            if ( JSON.stringify(page) !== initialPage ) {
                setPageUpdated(true);
            }
            else {
                setPageUpdated(false);
            }
        }
    });

    return (
        <div className="adminPage">
            {
                page ?
                    <section className="section">
                        <div className="section__title-holder">
                            <h2 className="section__title">
                                <i className={'content_title-icon fa fa-file'} />
                                { page.name[lang] ? page.name[lang] : page.name.ua }
                            </h2>
                            <div className="section__title-actions">
                                <span>
                                    <a href="/" className="btn btn__error" onClick={e => {e.preventDefault(); setShowRemovePage(true)}}>
                                        <i className="content_title-icon fa fa-trash-alt"/>
                                        { translate('delete') }
                                    </a>
                                    <a href="/" className="btn btn__success" onClick={e => onUpdatePage(e)} disabled={!pageUpdated}>
                                        <i className="content_title-icon fa fa-save"/>
                                        { translate('save') }
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="grid_col col-8">
                                <div className="widget">
                                    <div className="widget__title">
                                        <i className="content_title-icon fa fa-file-alt"/>
                                        { translate('content') }
                                    </div>
                                    <ContentEditor contentType="content" content={page.content} types={['text', 'media', 'divider', 'page']} setLessonContent={(newContent) => setContent(newContent)} loading={loading} setUpdated={() => true} />
                                </div>
                            </div>
                            <div className="grid_col col-4">
                                <div className="widget">
                                    <div className="widget__title">
                                        <i className="content_title-icon fa fa-info"/>
                                        { translate('info') }
                                    </div>
                                    <Form fields={pageInfoFields} setFieldValue={setInfoFieldValue} loading={loading} />
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <Preloader/>
            }
            {
                showRemovePage ?
                    <Confirm message={translate('sure_to_remove_page')} confirmAction={handleRemovePage} cancelAction={() => setShowRemovePage(false)} />
                    :
                    null
            }
        </div>
    );

    function setContent(newContent) {
        setPage({
            ...page,
            content: newContent
        });
    }

    function setInfoFieldValue(fieldID, value) {
        const newPageName = page.name;

        pageInfoFields.find(item => item.id === fieldID).value = value;
        pageInfoFields.find(item => item.id === fieldID).updated = !!value;

        if ( fieldID === 'name_ua' ) {
            newPageName.ua = value;
        }
        if ( fieldID === 'name_ru' ) {
            newPageName.ru = value;
        }
        if ( fieldID === 'name_en' ) {
            newPageName.en = value;
        }

        setPage({
            ...page,
            name: {
                ...newPageName
            },
            featured: fieldID === 'featured' ? value : page.featured
        });
    }

    function onUpdatePage(e) {
        e.preventDefault();

        if ( pageUpdated ) {
            setInitialPage(JSON.stringify(page));
            updatePage(page.id, {
                ...page
            });
            setPageInfoFields([
                {
                    value: page.featured,
                    id: 'featured',
                    type: 'image',
                    updated: false,
                    size: '100%',
                    shape: 'landscape',
                    icon: 'fa fa-image'
                },
                {
                    value: page.name.ua,
                    id: 'name_ua',
                    placeholder: translate('title') + ' ' + translate('in_ua'),
                    type: 'text',
                    updated: false
                },
                {
                    value: page.name.ru,
                    id: 'name_ru',
                    placeholder: translate('title') + ' ' + translate('in_ru'),
                    type: 'text',
                    updated: false
                },
                {
                    value: page.name.en,
                    id: 'name_en',
                    placeholder: translate('title') + ' ' + translate('in_en'),
                    type: 'text',
                    updated: false
                },
            ]);
        }
    }

    function handleRemovePage() {
        removePage(page.id);
    }
}
const mapStateToProps = state => ({
    pageData: state.staticInfoReducer.page,
    loading: state.staticInfoReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchPage: slug => dispatch(fetchPage(slug)),
    removePage: (pageID) => dispatch(removePage(pageID)),
    updatePage: (pageID, info) => dispatch(updatePage(pageID, info))
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPage));