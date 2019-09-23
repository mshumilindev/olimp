import React, { useEffect, useContext } from 'react';
import { fetchPage } from "../../redux/actions/staticInfoActions";
import {connect} from "react-redux";
import {Preloader} from "../../components/UI/preloader";
import Article from '../../components/Article/Article';
import siteSettingsContext from "../../context/siteSettingsContext";
import './studentPage.scss';

function StudentPage({params, page, fetchPage, loading}) {
    const { translate, lang } = useContext(siteSettingsContext);

    useEffect(() => {
        fetchPage(params.pageSlug);
    }, [params.pageSlug]);

    return (
        <div className="studentPage">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-file" />
                    {
                        !page ?
                            translate('page')
                            :
                            page.name[lang] ? page.name[lang] : page.name['ua']
                    }
                </h2>
            </div>
            {
                page ?
                    <>
                        {
                            page.featured ?
                                <div className="studentPage__featured" style={{backgroundImage: 'url(' + page.featured + ')'}}/>
                                :
                                null
                        }
                        <Article content={page.content} type="content" />
                    </>
                    :
                    <Preloader/>
            }
            {
                page ?
                    loading ?
                        <div className="studentPage__preloader">
                            <Preloader/>
                        </div>
                        :
                        null
                    :
                    null
            }
        </div>
    )
}

const mapStateToProps = state => ({
    page: state.staticInfoReducer.page,
    loading: state.staticInfoReducer.loading
});

const mapDispatchToProps = dispatch => ({
    fetchPage: slug => dispatch(fetchPage(slug))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentPage);