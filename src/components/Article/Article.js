import React, { useState, useContext, useRef, useEffect } from 'react';
import classNames from "classnames";
import siteSettingsContext from "../../context/siteSettingsContext";
import ArticleAnswer from './ArticleAnswer';
import {Preloader} from "../UI/preloader";
import ReactPlayer from 'react-player';

export default function Article({content, type, finishQuestions, loading, onBlockClick}) {
    const { lang } = useContext(siteSettingsContext);
    const [ contentPage, setContentPage ] = useState(0);
    const articleRef = useRef(null);
    const [ answers, setAnswers ] = useState({
        gotScore: 0,
        blocks: []
    });
    const [ size, setSize ] = useState({width: 0, height: 0});

    useEffect(() => {
        const width = articleRef.current.offsetWidth;

        setSize({
            width: width,
            height: width * 56.25 / 100
        });
    }, []);

    return (
        <article className="article" ref={articleRef}>
            { pagifyContent()[contentPage].map((block, index) => _renderBlock(block, index)) }
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

    function _renderBlock(block, index) {
        return (
            <div className={'article__block type-' + block.type} key={block.id} onClick={() => onBlockClick(index)}>
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
                    block.type === 'youtube' ?
                        <>
                            {
                                block.value ?
                                    <div className="youtube-holder">
                                        <ReactPlayer url={block.value} />
                                    </div>
                                    :
                                    null
                            }
                        </>
                        :
                        null
                }
                {
                    block.type === 'audio' && block.value.url ?
                        <div className={'article__audio'}>
                            {
                                block.value.caption ?
                                    <p>{ block.value.caption }</p>
                                    :
                                    null
                            }
                            <audio controls>
                                <source src={getPlayLink(block.value.url)}/>
                            </audio>
                        </div>
                        :
                        null
                }
                {
                    block.type === 'word' ?
                        <iframe
                            src={getWordURL(block.value)}
                            style={{width: '100%', height: size.width * 141 / 100, border: '1px solid grey'}} frameBorder="0"
                            allowFullScreen={true}
                            mozAllowFullScreen={true}
                            webkitAllowFullscreen={true} />
                        :
                        null
                }
                {
                    block.type === 'powerpoint' ?
                        <iframe
                            src={getPowerpointURL(block.value)}
                            style={{width: '100%', height: size.height}} frameBorder="0"
                            allowFullScreen={true}
                            mozAllowFullScreen={true}
                            webkitAllowFullscreen={true} />
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

    function getWordURL(url) {
        let newURL = url;

        if ( newURL.length ) {
            newURL = newURL += '?embedded=true&widget=false&headers=false&chrome=false';
        }

        return newURL;
    }

    function getPowerpointURL(url) {
        let newURL = url;

        if ( newURL.length ) {
            newURL = newURL.replace('/pub?', '/embed?')
        }
        return newURL;
    }

    function getPlayLink(url) {
        let newURL = url;

        if ( newURL.indexOf('https://drive.google.com/file/d/') !== -1 ) {
            newURL = newURL.replace('https://drive.google.com/file/d/', '');
        }
        if ( newURL.indexOf('https://drive.google.com/open?id=') !== -1 ) {
            newURL = newURL.replace('https://drive.google.com/open?id=', '');
        }
        if ( newURL.indexOf('/view?usp=sharing') !== -1 ) {
            newURL = newURL.replace('/view?usp=sharing', '');
        }

        if ( newURL.length ) {
            newURL = 'https://docs.google.com/uc?export=download&id=' + newURL;
        }

        return newURL;
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