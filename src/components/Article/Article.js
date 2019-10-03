import React, { useState, useContext } from 'react';
import classNames from "classnames";
import siteSettingsContext from "../../context/siteSettingsContext";
import ArticleAnswer from './ArticleAnswer';
import {Preloader} from "../UI/preloader";

export default function Article({content, type, finishQuestions, loading}) {
    const { lang } = useContext(siteSettingsContext);
    const [ contentPage, setContentPage ] = useState(0);
    const [ answers, setAnswers ] = useState({
        gotScore: 0,
        blocks: []
    });

    return (
        <article className="article">
            { pagifyContent()[contentPage].map(block => _renderBlock(block)) }
            {
                pagifyContent().length > 1 && type === 'content' ?
                    _renderPager(pagifyContent().length)
                    :
                    null
            }
            {
                loading ?
                    <div className="article__preloader">
                        <Preloader/>
                    </div>
                    :
                    null
            }
        </article>
    );

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
                {
                    block.type === 'answers' ?
                        <ArticleAnswer block={block} setContentPage={setContentPage} setAnswer={setAnswer} />
                        :
                        null
                }
            </div>
        )
    }

    function changePage(index) {
        if ( index !== contentPage ) {
            window.scrollTo({
                top: 0,
                left: 0
            });
            setContentPage(index);
        }
    }

    function pagifyContent() {
        const pages = [];
        let pageI = 0;
        const sortedContent = content.sort((a, b) => a.order - b.order);

        Array.from(Array(sortedContent.filter(item => item.type === 'page').length + 1)).forEach((page, index) => {
            let isPage = false;
            pages[index] = [];

            sortedContent.forEach((block, blockIndex) => {
                if ( blockIndex >= pageI ) {
                    if ( block.type === 'page' && !isPage ) {
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

    function setAnswer(block, score) {
        answers.gotScore += score;
        answers.blocks.push({
            id: block,
            score: score
        });
        if ( contentPage + 1 === pagifyContent().length ) {
            finishQuestions(answers);
        }
        else {
            setContentPage(contentPage + 1);

            setAnswers(answers);
        }
    }
}