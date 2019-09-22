import React, { useContext, useEffect, useState } from 'react';
import './studentLesson.scss';
import {fetchLesson} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';

function StudentCourseLesson({params, lesson, fetchLesson, allCoursesList}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ currentCourse, setCurrentCourse ] = useState(null);
    const [ contentPage, setContentPage ] = useState(0);

    useEffect(() => {
        if ( allCoursesList ) {
            const selectedSubject = allCoursesList.find(subject => subject.id === params.subjectID);
            const selectedCourse = selectedSubject.coursesList.find(course => course.id === params.courseID);

            setCurrentCourse({
                subject: selectedSubject,
                course: selectedCourse
            });

        }
    }, [allCoursesList, params.courseID, params.subjectID]);

    useEffect(() => {
        fetchLesson(params.subjectID, params.courseID, params.moduleID, params.lessonID);
    }, [params]);

    return (
        <div className="studentLesson">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-paragraph" />
                    {
                        lesson && currentCourse ?
                            <>
                                <div className="content__title-subtitle">
                                    {
                                        currentCourse.subject.name[lang] ?
                                            currentCourse.subject.name[lang]
                                            :
                                            currentCourse.subject.name['ua']
                                    }
                                </div>
                                {
                                    lesson.name[lang] ?
                                        lesson.name[lang]
                                        :
                                        lesson.name['ua']
                                }
                            </>
                            :
                            translate('lesson')
                    }
                </h2>
            </div>
            {
                !lesson ?
                    <Preloader/>
                    :
                    _renderLesson()
            }
        </div>
    );

    function _renderLesson() {
        return (
            <>
                { _renderContent(pagifyContent('content')) }
            </>
        )
    }

    function _renderContent(items) {
        return (
            <article className="article">
                { items[contentPage].map(block => _renderBlock(block)) }
                {
                    items.length > 1 ?
                        _renderPager(items.length)
                        :
                        null
                }
            </article>
        )
    }

    function _renderPager(length) {
        return (
            <div className="pager student">
                {
                    Array.from(Array(length)).map((num, index) => {
                        return (
                            <div className={classNames('pager__item', {active: contentPage === index})} key={index} onClick={() => changePage(index)}>
                                { index + 1 }
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    function changePage(index) {
        window.scrollTo({
            top: 0,
            left: 0
        });
        setContentPage(index);
    }

    function _renderBlock(block) {
        return (
            <div className={'article__block type-' + block.type} key={block.id}>
                {
                    block.type === 'text' ?
                        <div dangerouslySetInnerHTML={{__html: block.value[lang] ? block.value[lang] : block.value['ua']}}/>
                        :
                        null
                }
                {
                    block.type === 'media' ?
                        <>
                            <div className={'article__image size-' + block.value.size} style={{backgroundImage: 'url(' + block.value.image + ')'}}/>
                            {
                                block.value.caption[lang] || block.value.caption['ua'] ?
                                    <div className="article__image-caption">
                                        { block.value.caption[lang] ? block.value.caption[lang] : block.value.caption['ua'] }
                                    </div>
                                    :
                                    null
                            }
                        </>
                        :
                        null
                }
                {
                    block.type === 'divider' ?
                        <hr/>
                        :
                        null
                }
            </div>
        )
    }

    function pagifyContent(type) {
        const pages = [];
        let pageI = 0;
        const sortedContent = lesson[type].sort((a, b) => a.order - b.order);

        Array.from(Array(sortedContent.filter(item => item.type === 'page').length + 1)).forEach((page, index) => {
            let isPage = false;
            pages[index] = [];

            sortedContent.forEach((block, blockIndex) => {
                if ( blockIndex >= pageI ) {
                    if ( block.type === 'page' ) {
                        isPage = true;
                        pageI = blockIndex + 1;
                    }
                    if ( !isPage ) {
                        pages[index].push(block);
                    }
                }
            });
            isPage = false;

        });

        return pages;
    }
}

const mapStateToProps = state => ({
    lesson: state.coursesReducer.lesson,
    loading: state.coursesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchLesson: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLesson(subjectID, courseID, moduleID, lessonID))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentCourseLesson);
